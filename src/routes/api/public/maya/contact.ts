import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/public/maya/contact")({
  server: {
    handlers: {
      POST: () =>
        Response.json(
          {
            message:
              "In-app email delivery is not configured yet. Nothing was sent. Please send your confirmed draft through WhatsApp.",
          },
          { status: 503 },
        ),
    },
  },
});
