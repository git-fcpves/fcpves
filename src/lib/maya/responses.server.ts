import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool, isStepCount, type ModelMessage } from "ai";
import { z } from "zod";
import { rememberBlock } from "./access.server";

import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.ts";

export function createResponsesCall(
  request: Request,
  config: { baseURL: string; apiKey: string; model: string },
  messages: ModelMessage[],
  instructions?: string,
) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: `${config.baseURL.replace(/\/+$/, "").replace(/\/v1$/, "")}/v1`,
    apiKey: config.apiKey,
    headers: { "Lovable-API-Key": config.apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input, init) => {
      const response = await runIdFetch.fetch(input, init);
      await rememberBlock("chat", response);
      return response;
    },
  });
  const reasoning = config.model !== "openai/chat-latest";
  const result = streamText({
    model: provider.responses(config.model),
    // AI SDK 6 lacks `instructions`: rename this key to `system` there.
    ...(instructions ? { instructions } : {}),
    messages,
    abortSignal: request.signal,
    maxRetries: 0,
    stopWhen: isStepCount(50),
    tools: {
      offerNavigation: tool({
        description: "Offer a verified website page; requires the visitor to click, never navigates automatically.",
        inputSchema: z.object({ page: z.enum(["home", "about", "work", "projects", "connect"]) }).strict(),
        execute: async ({ page }) => ({ page }),
      }),
      prepareEnquiry: tool({
        description: "Prepare an enquiry preview only after the visitor provides name, reply contact and message. This does not send anything.",
        inputSchema: z.object({ name: z.string(), contact: z.string(), message: z.string() }).strict(),
        execute: async ({ name, contact, message }) => ({ name: name.slice(0, 100), contact: contact.slice(0, 200), message: message.slice(0, 3000), delivered: false }),
      }),
    },
    providerOptions: {
      openai: {
        store: false,
        ...(reasoning
          ? {
              forceReasoning: true,
              reasoningEffort: "medium",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            }
          : {}),
      },
    },
  });
  return {
    result,
    gateway: runIdFetch,
    response: () =>
      withLovableAiGatewayRunIdHeader(result.toUIMessageStreamResponse({ sendReasoning: true }), runIdFetch),
  };
}
