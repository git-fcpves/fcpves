import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { requestSpeech } from "@/lib/maya/speech-request.server";
import { blockedGateway, rememberBlock, validateOrigin } from "@/lib/maya/access.server";

export const Route = createFileRoute("/api/public/maya/speech")({ server: { handlers: { POST: async ({ request }) => {
  const originError = validateOrigin(request); if (originError) return originError;
  const blocked = await blockedGateway("speech"); if (blocked) return blocked;
  try {
    const { text } = z.object({ text: z.string().min(1).max(6000) }).parse(await request.json());
    const key = process.env["LOVABLE_API_KEY"]; if (!key) return Response.json({ message: "Maya's voice is not configured." }, { status: 401 });
    const upstream = await requestSpeech({ baseURL: "https://ai.gateway.lovable.dev", apiKey: key, model: "google/gemini-3.1-flash-tts-preview", format: "gemini", voice: process.env["MAYA_VOICE"] ?? "Kore" }, `Speak warmly in natural Indian English with a soft, friendly young-adult female voice, gentle expression and conversational pacing. Read only the following words:\n${text}`, false, request.signal);
    await rememberBlock("speech", upstream);
    return new Response(upstream.body, { status: upstream.status, headers: { "Content-Type": upstream.headers.get("content-type") ?? "text/event-stream", "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ message: error instanceof z.ZodError ? "This reply is too long to speak." : "Maya's voice is unavailable. Text chat still works." }, { status: request.signal.aborted ? 499 : 503 });
  }
} } } });