import { createFileRoute } from "@tanstack/react-router";
import { getGallery } from "@/lib/drive.server";

export const Route = createFileRoute("/api/public/videos")({
  server: {
    handlers: {
      GET: async () => {
        const { payload } = await getGallery();
        return Response.json(payload, { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
