import { createFileRoute } from "@tanstack/react-router";

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
const links = [
  { l: "Instagram", h: "https://www.instagram.com/ig.fcpves/" },
  { l: "YouTube", h: "https://www.youtube.com/@yt.fcpves" },
  { l: "Website", h: "https://fcpves.in" },
  { l: "Email", h: "mailto:support@fcpves.in" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Index() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-14">
      <header className="text-center">
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

      <Section title="About">
        <p className="leading-relaxed text-muted-foreground">
          I craft cinematic wedding films, reels and brand stories — with a focus on natural skin tones and elegant color grading in Final Cut Pro.
        </p>
      </Section>

      <Section title="Work">
        <div className="flex flex-wrap gap-2">
          {work.map((w) => (
            <span key={w} className="rounded-full border px-3 py-1.5 text-sm">{w}</span>
          ))}
        </div>
      </Section>

      <Section title="Experience">
        <ul className="space-y-3">
          {experience.map((e) => (
            <li key={e.t} className="rounded-xl border bg-card p-4">
              <div className="font-medium">{e.t}</div>
              <div className="text-sm text-muted-foreground">{e.s}</div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Tools">
        <p className="text-muted-foreground">Final Cut Pro · Adobe Photoshop</p>
      </Section>

      <Section title="Connect">
        <div className="grid grid-cols-2 gap-3">
          {links.map((k) => (
            <a key={k.l} href={k.h} target="_blank" rel="noreferrer"
              className="rounded-xl border bg-card py-3 text-center text-sm transition-colors hover:border-primary hover:text-primary">
              {k.l}
            </a>
          ))}
        </div>
        <a href="tel:7619633201" className="mt-3 block rounded-xl bg-primary py-3 text-center font-medium text-primary-foreground">
          Call 76196 33201
        </a>
      </Section>

      <footer className="mt-14 text-center text-xs text-muted-foreground">© FCPVES</footer>
    </main>
  );
}
