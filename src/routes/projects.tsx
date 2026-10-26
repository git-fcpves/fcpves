import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Film, FolderOpen, Github, Sparkles, Workflow } from "lucide-react";
import { Dock } from "../components/dock";
import { BackButton } from "../components/back-button";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects · Sagar Salimath" },
      { name: "description", content: "AI, GPT, GitHub, editing and automation projects by Sagar Salimath." },
      { property: "og:title", content: "Projects · Sagar Salimath" },
      { property: "og:description", content: "AI, GPT, GitHub, editing and automation projects by Sagar Salimath." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Projects,
});

const groups = [
  { l: "AI projects", d: "Built with AI tools", Icon: Sparkles },
  { l: "GPT projects", d: "Built on GPT", Icon: Bot },
  { l: "GitHub projects", d: "Code and small tools", Icon: Github },
  { l: "Editing projects", d: "Wedding films, reels, brand edits", Icon: Film },
  { l: "Automation projects", d: "Workflow automations", Icon: Workflow },
];

function Projects() {
  const [active, setActive] = useState("projects");

  return (
    <>
      <main className="mx-auto min-h-screen max-w-md px-6 pb-32 pt-14">
        <BackButton />
        <h1 className="font-display text-4xl">Projects</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Five kinds of work I keep building. Pick a category.
        </p>

        <ul className="mt-10 space-y-3">
          {groups.map(({ l, d, Icon }) => (
            <li key={l} className="flex items-center gap-4 rounded-xl border bg-card p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-accent">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{l}</span>
                <span className="block truncate text-sm text-muted-foreground">{d}</span>
              </span>
              <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
            </li>
          ))}
        </ul>

        <footer className="mt-14 text-center text-xs text-muted-foreground">© FCPVES</footer>
      </main>

      <Dock active={active} onPick={setActive} />
    </>
  );
}
