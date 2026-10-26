import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dock } from "../components/dock";
import { WorkSection } from "../components/work-section";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work · Sagar Salimath" },
      { name: "description", content: "Cinematic, candid, teasers, corporate, ad films, promotional, AI, biography and political videos by Sagar Salimath." },
      { property: "og:title", content: "Work · Sagar Salimath" },
      { property: "og:description", content: "Nine kinds of video work, each with sample clips to preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Work,
});

function Work() {
  const [active, setActive] = useState("work");

  return (
    <>
      <main className="mx-auto min-h-screen max-w-md px-6 pb-32 pt-14">
        <h1 className="font-display text-4xl">Work</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Nine kinds of edits. Tap a category to preview sample clips.
        </p>

        <div className="mt-10">
          <WorkSection />
        </div>

        <footer className="mt-14 text-center text-xs text-muted-foreground">© FCPVES</footer>
      </main>

      <Dock active={active} onPick={setActive} />
    </>
  );
}
