import { createFileRoute } from "@tanstack/react-router";
import { isDriveId } from "@/lib/drive-videos";
import { driveHeaders, getGallery } from "@/lib/drive.server";

// Serves a mid-size preview picture for a gallery video.
export const Route = createFileRoute("/api/public/thumb/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = params.id;
        if (!isDriveId(id)) return new Response("Not found", { status: 404 });
        const link = (await getGallery()).thumbs.get(id);
        if (!link) return new Response("Not found", { status: 404 });
        const url = link.replace(/=s\d+$/, "=w720");
        let res = await fetch(url);
        if (!res.ok) res = await fetch(url, { headers: driveHeaders() });
        if (!res.ok) return new Response("Not found", { status: 404 });
        return new Response(res.body, {
          headers: {
            "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
