import { createFileRoute } from "@tanstack/react-router";
import { isDriveId } from "@/lib/drive-videos";
import { driveHeaders, driveUrl, isInFolder, removeUnavailableVideo } from "@/lib/drive.server";

// Streams a video from the configured Drive folder through the site, so the Drive file is never exposed.
export const Route = createFileRoute("/api/public/video/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const id = params.id;
        if (!isDriveId(id) || !(await isInFolder(id))) return new Response("Not found", { status: 404 });
        // Only plays on this site: refuse requests sent from other websites.
        const site = request.headers.get("sec-fetch-site");
        if (site === "cross-site") return new Response("Forbidden", { status: 403 });

        const extra: Record<string, string> = {};
        const range = request.headers.get("range");
        if (range && /^bytes=\d*-\d*$/.test(range)) extra["Range"] = range;
        const upstream = await fetch(driveUrl(`/files/${id}?alt=media&supportsAllDrives=true`), {
          headers: driveHeaders(extra),
        });
        if (!upstream.ok && upstream.status !== 206) {
          const detail = await upstream.text();
          console.error(`Drive stream failed [${upstream.status}]: ${detail}`);
          if (upstream.status === 404 || upstream.status === 410) removeUnavailableVideo(id);
          return new Response(`Video unavailable [${upstream.status}]: ${detail}`, { status: upstream.status });
        }
        const headers = new Headers({
          "Content-Type": upstream.headers.get("content-type") ?? "video/mp4",
          "Accept-Ranges": "bytes",
          "Cache-Control": "private, no-store",
          "Content-Disposition": "inline",
          "X-Content-Type-Options": "nosniff",
        });
        for (const h of ["content-length", "content-range"]) {
          const v = upstream.headers.get(h);
          if (v) headers.set(h, v);
        }
        return new Response(upstream.body, { status: upstream.status, headers });
      },
    },
  },
});
