import { createFileRoute } from "@tanstack/react-router";
import { Dock } from "../components/dock";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Sagar Salimath" },
      { name: "description", content: "About Sagar Salimath, his experience and the tools he edits with." },
      { property: "og:title", content: "About Sagar Salimath" },
      { property: "og:description", content: "Experience and tools of video editor Sagar Salimath." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

const experience = [
  { t: "Clickers Cabin Photography & Academy", s: "Current" },
  { t: "Million's Photography & Films", s: "Video Editor · 6 months" },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">{title}</h2>
      {children}
    </section>
  );
}

function AboutPage() {
  return (
    <>
      <main className="mx-auto min-h-screen max-w-md px-6 pb-32 pt-14">
        <h1 className="font-display text-4xl">About</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          I craft cinematic wedding films, reels and brand stories, with a focus on natural skin tones and elegant color grading in Final Cut Pro.
        </p>
        <Block title="Experience">
          <ul className="space-y-3">
            {experience.map((e) => (
              <li key={e.t} className="rounded-xl border bg-card p-4">
                <div className="font-medium">{e.t}</div>
                <div className="text-sm text-muted-foreground">{e.s}</div>
              </li>
            ))}
          </ul>
        </Block>
        <Block title="Tools">
          <p className="text-muted-foreground">Final Cut Pro · Adobe Photoshop</p>
        </Block>
      </main>
      <Dock active="about" onPick={() => {}} />
    </>
  );
}
