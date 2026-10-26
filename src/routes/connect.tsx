import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  Globe,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import { Dock } from "../components/dock";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Connect · Sagar Salimath" },
      { name: "description", content: "Reach Sagar Salimath on Instagram, YouTube, WhatsApp, email or phone." },
      { property: "og:title", content: "Connect · Sagar Salimath" },
      { property: "og:description", content: "Reach Sagar Salimath on Instagram, YouTube, WhatsApp, email or phone." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Connect,
});

type Option = {
  l: string;
  v: string;
  h: string;
  Icon: typeof Instagram;
  blank?: boolean;
};

const social: Option[] = [
  { l: "Instagram", v: "@ig.fcpves", h: "https://www.instagram.com/ig.fcpves/", Icon: Instagram, blank: true },
  { l: "YouTube", v: "yt.fcpves", h: "https://www.youtube.com/@yt.fcpves", Icon: Youtube, blank: true },
  { l: "Website", v: "fcpves.in", h: "https://fcpves.in", Icon: Globe, blank: true },
];

const direct: Option[] = [
  { l: "WhatsApp", v: "+91 76196 33201", h: "https://wa.me/917619633201", Icon: MessageCircle, blank: true },
  { l: "Email", v: "support@fcpves.in", h: "mailto:support@fcpves.in", Icon: Mail },
  { l: "Call", v: "+91 76196 33201", h: "tel:+917619633201", Icon: Phone },
];

function Row({ l, v, h, Icon, blank }: Option) {
  return (
    <a
      href={h}
      {...(blank ? { target: "_blank", rel: "noreferrer" } : {})}
      className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-border"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-primary">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{l}</span>
        <span className="block truncate text-sm text-muted-foreground">{v}</span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </a>
  );
}

function Group({ title, items }: { title: string; items: Option[] }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">{title}</h2>
      <div className="space-y-3">
        {items.map((o) => (
          <Row key={o.l} {...o} />
        ))}
      </div>
    </section>
  );
}

function Connect() {
  const [active, setActive] = useState("connect");

  return (
    <>
      <main className="mx-auto min-h-screen max-w-md px-6 pb-32 pt-14">
        <h1 className="font-display text-4xl">Connect</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick whichever works for you. I usually reply fastest on WhatsApp.
        </p>

        <Group title="Social" items={social} />
        <Group title="Direct" items={direct} />

        <footer className="mt-14 text-center text-xs text-muted-foreground">© FCPVES</footer>
      </main>

      <Dock active={active} onPick={setActive} />
    </>
  );
}
