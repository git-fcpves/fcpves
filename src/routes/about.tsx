import { createFileRoute } from "@tanstack/react-router";
import { Dock } from "../components/dock";
import { BackButton } from "../components/back-button";
import founderPortrait from "../assets/founder-portrait.png.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Sagar Salimath" },
      { name: "description", content: "About Sagar Salimath, filmmaker, cinematic video editor and AI digital media specialist." },
      { property: "og:title", content: "About Sagar Salimath" },
      { property: "og:description", content: "Filmmaker, cinematic video editor and AI digital media specialist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

const summary =
  "Creative and versatile media professional with experience in cinematic video editing, news editing, wedding films, short movies, documentaries and digital storytelling. Experienced in customer support, accounting, AI powered tools, workflow automation and digital marketing.";

const experience = [
  { y: "2026", t: "Cinematic Video Editor", o: "Millions Photography & Films", d: "Cinematic videos for photography and filmmaking projects, with visual storytelling, pacing and cinematic presentation." },
  { y: "2026", t: "Cinematic Storytelling Video Editor", o: "Clickers Cabin Photography", d: "Cinematic storytelling videos with narrative flow, visual continuity and emotional impact." },
  { y: "2025", t: "All-Rounder", o: "Divij Creation · Celebrate Management Company", d: "Creative and operational support across the company." },
  { y: "2025 to Present", t: "AI Automation & Digital Marketing", o: "", d: "GPTs and plugins, n8n workflows, voice command AI, social media and influencer marketing, SEO, Meta Ads and Google Ads." },
  { y: "2024", t: "Accountant", o: "Paras Plumbing Shop", d: "Accounting, cinematic wedding video editing, AI integrations and automation projects." },
  { y: "2023", t: "Customer Support Executive", o: "Kocher Tech", d: "Customer support and service operations." },
  { y: "2023", t: "Customer Support Executive", o: "Maxicus · boAt Devices", d: "Customer support for boAt devices." },
  { y: "2022", t: "Cinematic Wedding Video Editor", o: "", d: "Cinematic wedding films with storytelling and visual presentation." },
  { y: "2021", t: "Freelance Film Editor", o: "", d: "Wedding videos, short movies, story editing and documentaries." },
  { y: "2019 to 2021", t: "Freelance Video Editor", o: "", d: "Wedding films, podcasts, YouTube vlogs and show editing." },
  { y: "2018", t: "News Editor", o: "Focus TV Kannada", d: "News editing and broadcast video content." },
  { y: "2017", t: "News Video Editor", o: "TV1 Kannada News Channel", d: "News video content for broadcast." },
  { y: "2016", t: "Actor", o: "Mahasati Kannada Serial", d: "Supporting villain role." },
];

const skills = [
  "Cinematic video editing", "Wedding film editing", "News and broadcast editing",
  "Short movie and documentary editing", "Storytelling and narrative editing",
  "Video production and post-production", "AI powered content creation",
  "GPTs and plugin workflows", "n8n workflow automation", "Voice command AI systems",
  "Website AI integrations", "Social media and influencer marketing", "SEO",
  "Meta Ads and Google Ads", "Promotional content creation", "Customer support", "Accounting",
];

const tools = [
  "Final Cut Pro Creator's Studio", "Wondershare Filmora 17", "Adobe Photoshop",
  "Canva", "Adobe Illustrator", "Apple Motion",
];

const awards = [
  "Google AI Studio AI Award Poster",
  "Final Cut Pro Excellence Award",
  "Fastest Video Editor of Bangalore 2023",
  "Best Multimedia AI Designer 2023",
  "International Envato Workshop 2019 · Participant",
  "Best Mac Systems for Editing Workshop, Delhi 2025 · Participant",
  "National Level Chess Championship · Participant",
  "Best AI Multimedia Designer 2026",
];

const sports = [
  "State-level participant in shot put",
  "State-level participant in kabaddi",
  "State-level chess champion",
];

const languages = [
  { name: "Kannada", level: 5 }, { name: "Hindi", level: 5 }, { name: "English", level: 4 },
  { name: "Tamil", level: 3 }, { name: "Telugu", level: 3 }, { name: "Marathi", level: 3 },
  { name: "Konkani", level: 3 }, { name: "Punjabi", level: 3 }, { name: "Urdu", level: 3 },
  { name: "Malayalam", level: 2 },
];

const interests = ["Cooking", "Bike riding", "Digital games"];

function Reveal({ i, children, className = "" }: { i: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={`animate-fade-up ${className}`} style={{ animationDelay: `${Math.min(i, 14) * 70}ms` }}>
      {children}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">{title}</h2>
      {children}
    </section>
  );
}

function AboutPage() {
  return (
    <>
      <main className="mx-auto min-h-screen max-w-md px-6 pb-32 pt-14">
        <BackButton />

        <Reveal i={0} className="flex flex-col items-center text-center">
          <img
            src={founderPortrait.url}
            alt="Sagar Salimath"
            className="animate-pop h-28 w-28 rounded-full border-2 border-primary/50 object-cover shadow-[0_0_40px_-8px_var(--primary)]"
          />
          <h1 className="mt-5 font-display text-4xl">Sagar Salimath</h1>
          <p className="mt-2 text-sm text-accent">Filmmaker · Cinematic Video Editor · AI & Digital Media Specialist</p>
        </Reveal>

        <Block title="Profile">
          <Reveal i={1}>
            <p className="leading-relaxed text-muted-foreground">{summary}</p>
          </Reveal>
        </Block>

        <Block title="Experience">
          <ol className="relative space-y-4 border-l border-border pl-5">
            {experience.map((e, i) => (
              <Reveal i={i + 2} key={`${e.y}-${e.t}`}>
                <li className="relative rounded-xl border bg-card p-4">
                  <span className="absolute -left-[27px] top-5 h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
                  <div className="text-xs text-accent">{e.y}</div>
                  <div className="mt-1 font-medium">{e.t}</div>
                  {e.o ? <div className="text-sm text-muted-foreground">{e.o}</div> : null}
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Block>

        <Block title="Skills">
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <Reveal i={i} key={s}>
                <span className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground">{s}</span>
              </Reveal>
            ))}
          </div>
        </Block>

        <Block title="Software & Tools">
          <div className="flex flex-wrap gap-2">
            {tools.map((t, i) => (
              <Reveal i={i} key={t}>
                <span className="rounded-full border border-primary/40 bg-card px-3 py-1.5 text-xs">{t}</span>
              </Reveal>
            ))}
          </div>
        </Block>

        <Block title="Education">
          <div className="space-y-3">
            <Reveal i={0}>
              <div className="rounded-xl border bg-card p-4">
                <div className="font-medium">SSLC</div>
                <div className="text-sm text-muted-foreground">KRCES English Medium School, Bailhongal</div>
              </div>
            </Reveal>
            <Reveal i={1}>
              <div className="rounded-xl border bg-card p-4">
                <div className="font-medium">PUC</div>
                <div className="text-sm text-muted-foreground">Government Pre-University College, Bailwad</div>
              </div>
            </Reveal>
          </div>
        </Block>

        <Block title="Certificates & Awards">
          <ol className="space-y-3">
            {awards.map((a, i) => (
              <Reveal i={i} key={a}>
                <li className="flex items-start gap-3 rounded-xl border bg-card p-4">
                  <span className="font-display text-lg text-accent">{i + 1}</span>
                  <span className="text-sm leading-relaxed">{a}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </Block>

        <Block title="Personal Project">
          <Reveal i={0}>
            <div className="rounded-xl border bg-card p-4">
              <div className="font-medium">Bili Haale · Short Movie</div>
              <div className="text-sm text-muted-foreground">Filmmaker and Editor · June 2017 to Present</div>
            </div>
          </Reveal>
        </Block>

        <Block title="Sports & Achievements">
          <ul className="space-y-3">
            {sports.map((s, i) => (
              <Reveal i={i} key={s}>
                <li className="rounded-xl border bg-card p-4 text-sm">{s}</li>
              </Reveal>
            ))}
          </ul>
        </Block>

        <Block title="Languages">
          <div className="space-y-3">
            {languages.map((l, i) => (
              <Reveal i={i} key={l.name}>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{l.name}</span>
                    <span className="text-muted-foreground">{l.level}/5</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="animate-grow-bar h-full rounded-full bg-[image:var(--gradient-accent)]"
                      style={{ width: `${(l.level / 5) * 100}%`, animationDelay: `${Math.min(i, 14) * 70}ms` }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Block>

        <Block title="Interests">
          <div className="flex flex-wrap gap-2">
            {interests.map((it, i) => (
              <Reveal i={i} key={it}>
                <span className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground">{it}</span>
              </Reveal>
            ))}
          </div>
        </Block>
      </main>
      <Dock active="about" onPick={() => {}} />
    </>
  );
}
