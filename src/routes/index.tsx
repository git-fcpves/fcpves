import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Dock, dockItems } from "../components/dock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sagar Salimath — Video Editor & Visual Storyteller" },
      { name: "description", content: "Cinematic wedding films, reels and brand videos edited by Sagar Salimath." },
      { property: "og:title", content: "Sagar Salimath — Video Editor" },
      { property: "og:description", content: "Cinematic wedding films, reels and brand videos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const stats = [
  { n: "300+", l: "Reels" },
  { n: "100+", l: "Cinematic films" },
  { n: "100+", l: "Teasers" },
];
const work = ["Wedding films", "Cinematic edits", "Reels & shorts", "Promo & brand films", "AI videos", "Motion graphics"];
const experience = [
  { t: "Clickers Cabin Photography & Academy", s: "Current" },
  { t: "Million's Photography & Films", s: "Video Editor · 6 months" },
];

const homeIds = dockItems.filter((d) => d.id !== "connect").map((d) => d.id);
const FIRST_ID = homeIds[0] ?? "home";
const LAST_ID = homeIds[homeIds.length - 1] ?? "experience";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-6">
      <h2 className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Index() {
  const [active, setActive] = useState(FIRST_ID);

  useEffect(() => {
    const onScroll = () => {
      const line = window.scrollY + 96;
      let current = FIRST_ID;
      for (const id of homeIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= line) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        current = LAST_ID;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <main className="mx-auto min-h-screen max-w-md px-6 pb-32 pt-14">
        <header id="home" className="scroll-mt-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-primary/40 font-display text-4xl text-primary">
            SS
          </div>
          <h1 className="mt-6 font-display text-4xl">Sagar Salimath</h1>
          <p className="mt-2 text-sm text-muted-foreground">Video Editor · Visual Storyteller · Creative Technologist</p>
        </header>

        <div className="mt-10 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.l} className="rounded-xl border bg-card py-4 text-center">
              <div className="font-display text-2xl text-primary">{s.n}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        <Section id="about" title="About">
          <p className="leading-relaxed text-muted-foreground">
            I craft cinematic wedding films, reels and brand stories — with a focus on natural skin tones and elegant color grading in Final Cut Pro.
          </p>
        </Section>

        <Section id="work" title="Work">
          <div className="flex flex-wrap gap-2">
            {work.map((w) => (
              <span key={w} className="rounded-full border px-3 py-1.5 text-sm">{w}</span>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience">
          <ul className="space-y-3">
            {experience.map((e) => (
              <li key={e.t} className="rounded-xl border bg-card p-4">
                <div className="font-medium">{e.t}</div>
                <div className="text-sm text-muted-foreground">{e.s}</div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="tools" title="Tools">
          <p className="text-muted-foreground">Final Cut Pro · Adobe Photoshop</p>
        </Section>

        <footer className="mt-14 text-center text-xs text-muted-foreground">© FCPVES</footer>
      </main>

      <Dock active={active} />
    </>
  );
}
