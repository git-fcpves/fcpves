import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, validateUIMessages, type UIMessage } from "ai";
import { z } from "zod";
import { createResponsesCall } from "@/lib/maya/responses.server";
import { blockedGateway, validateOrigin } from "@/lib/maya/access.server";
import { mayaInstructions } from "@/lib/maya/knowledge.server";
import { withLovableAiGatewayRunIdHeader } from "@/lib/maya/run-id.ts";

export const Route = createFileRoute("/api/public/maya/chat")({ server: { handlers: { POST: async ({ request }) => {
  const originError = validateOrigin(request); if (originError) return originError;
  if (Number(request.headers.get("content-length")) > 150000) return Response.json({ message: "This conversation is too long. Please start a new chat." }, { status: 413 });
  const blocked = await blockedGateway("chat"); if (blocked) return blocked;
  try {
    const body = z.object({ messages: z.array(z.unknown()).min(1).max(200) }).passthrough().parse(await request.json());
    if (JSON.stringify(body.messages).length > 150000) return Response.json({ message: "Please start a new chat." }, { status: 413 });
    const messages = await validateUIMessages({ messages: body.messages as UIMessage[] });
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return Response.json({ message: "Maya's AI is not configured." }, { status: 401 });
    const call = createResponsesCall(request, { baseURL: "https://ai.gateway.lovable.dev/v1", apiKey: key, model: "openai/gpt-6-astra" }, await convertToModelMessages(messages), mayaInstructions);
    return withLovableAiGatewayRunIdHeader(call.result.toUIMessageStreamResponse({ originalMessages: messages, sendReasoning: true, onFinish: () => {}, onError: (error) => error instanceof Error ? error.message : "Maya couldn't complete this reply." }), call.gateway);
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499 });
    return Response.json({ message: error instanceof z.ZodError ? "Please send a valid message." : "Maya could not read this conversation. Please start a new chat." }, { status: 400 });
  }
} } } });