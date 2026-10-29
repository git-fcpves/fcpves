import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bot, Github, Sparkles, Workflow } from "lucide-react";
import { Dock } from "../components/dock";
import { useGalleryVideos } from "../components/work-section";
import { VideoPreview, type VideoClip } from "../components/video-preview";
import { SocialGraphs } from "../components/social-graphs";
import { audienceQueryOptions, fallbackPayload } from "../lib/audience";
import { Button } from "../components/ui/button";
import founderPortrait from "../assets/founder-current.webp.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sagar Salimath · Video Editor & Visual Storyteller" },
      {
        name: "description",
        content:
          "Cinematic wedding films, reels and brand videos edited by Sagar Salimath, plus his GPTs and automation projects.",
      },
      { property: "og:title", content: "Sagar Salimath · Video Editor" },
      {
        property: "og:description",
        content: "Cinematic wedding films, reels, brand videos, GPTs and automations.",
      },
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
const homeIds = ["home"];

type GPT = { l: string; d: string; h: string };

const gpts: GPT[] = [
  {
    l: "Photography GPT",
    d: "Shoot planning, posing and client replies",
    h: "https://chatgpt.com/g/g-6adc3f9c53548191bd24c45cc65cb238-photographygpt",
  },
  {
    l: "FCPVES Colorist AI",
    d: "Color grading notes for Final Cut Pro",
    h: "https://chatgpt.com/g/g-6ade2ca1a7108191ab900c44c0a34817-fcpves-colorist-ai",
  },
  {
    l: "Editor Sagar",
    d: "Business and creativity helper for editors",
    h: "https://chatgpt.com/g/g-6a381ae33a888191bfa37c8f283fd371-editor-sagar",
  },
];

const internal = [
  { l: "Automation projects", d: "Workflow automations", Icon: Workflow },
  { l: "AI projects", d: "Built with AI tools", Icon: Sparkles },
  { l: "GitHub projects", d: "Code and small tools", Icon: Github },
];

function SectionHead({ title, to, label }: { title: string; to: string; label: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="text-xs uppercase tracking-[0.3em] text-accent">{title}</h2>
      <Link to={to} className="text-xs text-muted-foreground transition-colors hover:text-accent">
        {label}
      </Link>
    </div>
  );
}

function GptRow({ l, d, h }: GPT) {
  return (
    <a
      href={h}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-4 rounded-xl border bg-card p-4 card-hover"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-accent">
        <Bot className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{l}</span>
        <span className="block text-sm leading-snug text-muted-foreground">{d}</span>

      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </a>
  );
}

function Index() {
  const [selectedVideo, setSelectedVideo] = useState<VideoClip | null>(null);
  const [active, setActive] = useState("home");
  const lock = useRef(0);
  const { data: audience } = useQuery(audienceQueryOptions());
  const { videos: featuredWork, isPending: videosLoading } = useGalleryVideos();

  useEffect(() => {
    if (selectedVideo && !featuredWork.some((v) => v.src === selectedVideo.src)) setSelectedVideo(null);
  }, [featuredWork, selectedVideo]);

  const pick = (id: string) => {
    lock.current = Date.now() + 800;
    setActive(id);
  };

  useEffect(() => {
    const onScroll = () => {
      if (Date.now() < lock.current) return;
      const line = window.scrollY + 96;
      let current = "home";
      for (const id of homeIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= line) current = id;
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
          <img
            src={founderPortrait.url}
            alt="Sagar Salimath, founder of FCPVES"
            width={96}
            height={96}
            className="mx-auto h-24 w-24 rounded-full border border-border object-cover"
          />
          <h1 className="mt-6 font-display text-4xl">Sagar Salimath</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Video Editor · Visual Storyteller · Creative Technologist
          </p>
        </header>

        <div className="mt-10 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.l} className="rounded-xl border bg-card py-4 text-center card-hover">
              <div className="font-display text-2xl text-accent">{s.n}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        <section className="mt-12">
          <SectionHead title="Audience" to="/connect" label="Connect" />
          <SocialGraphs payload={audience ?? fallbackPayload} />
        </section>

        <section className="mt-12">
          <SectionHead title="Sample work" to="/work" label="All work" />
          <div className="grid grid-cols-3 gap-2">
            {videosLoading &&
              Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="block aspect-[3/2] animate-pulse rounded-lg border bg-card" />
              ))}
            {featuredWork.map((w) => (
              <Button
                key={w.id}
                variant="ghost"
                onClick={() => setSelectedVideo(w)}
                aria-label={`Play ${w.title}`}
                className="group block h-auto min-w-0 whitespace-normal p-0 text-left hover:bg-transparent"
              >
                <span className="block overflow-hidden rounded-lg border bg-card card-hover">
                  <img
                    src={w.poster}
                    alt={w.title}
                    loading="lazy"
                    draggable={false}
                    width={720}
                    height={480}
                    className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </span>
                <span className="mt-1 block truncate text-[10px] text-muted-foreground">
                  {w.title}
                </span>
              </Button>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionHead title="My GPTs" to="/projects" label="All projects" />
          <div className="space-y-3">
            {gpts.map((g) => (
              <GptRow key={g.l} {...g} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionHead title="More projects" to="/projects" label="Open" />
          <ul className="space-y-3">
            {internal.map(({ l, d, Icon }) => (
              <li key={l}>
                <Link
                  to="/projects"
                  className="flex items-center gap-4 rounded-xl border bg-card p-4 card-hover"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-accent">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{l}</span>
                    <span className="block text-sm leading-snug text-muted-foreground">{d}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-14 text-center text-xs text-muted-foreground">© FCPVES</footer>
      </main>

      <Dock active={active} onPick={pick} />
      <VideoPreview clip={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </>
  );
}
