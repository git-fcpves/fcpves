import { useEffect, useState } from "react";
import { X } from "lucide-react";
import clip1 from "../assets/sample-filesamples.mp4.asset.json";
import clip2 from "../assets/sample-testvideos.mp4.asset.json";
import clip3 from "../assets/sample-mdn.mp4.asset.json";
import clip4 from "../assets/sample-w3.mp4.asset.json";
import clip5 from "../assets/sample-samplelib.mp4.asset.json";
import thumbBeach from "../assets/thumb-filesamples.jpg";
import thumbFlower from "../assets/thumb-mdn.jpg";
import thumbPark from "../assets/thumb-samplelib.jpg";
import thumbTest from "../assets/thumb-testvideos.jpg";
import thumbShortA from "../assets/thumb-w3a.jpg";
import thumbShortB from "../assets/thumb-w3b.jpg";

type Clip = { title: string; src: string };
type Category = { name: string; clips: Clip[] };
export type Featured = { title: string; src: string; poster: string };

const SOURCES: string[] = [clip1, clip2, clip3, clip4, clip5]
  .map((c) => (typeof c.url === "string" ? c.url : ""))
  .filter((u) => u.length > 0);

const clipSrc = (i: number): string => SOURCES[i % SOURCES.length] ?? "";

const NAMES = [
  "Cinematic videos",
  "Candid videos",
  "Teasers",
  "Corporate videos",
  "Ad films",
  "Promotional videos",
  "AI videos",
  "Biography videos",
  "Political videos",
];

export const workCategories: Category[] = NAMES.map((name, i) => ({
  name,
  clips: [
    { title: "Sample clip 1", src: clipSrc(i * 2) },
    { title: "Sample clip 2", src: clipSrc(i * 2 + 1) },
  ],
}));

export const featuredWork: Featured[] = [
  { title: "Cinematic film", src: clipSrc(0), poster: thumbBeach },
  { title: "Teaser cut", src: clipSrc(1), poster: thumbTest },
  { title: "Macro reel", src: clipSrc(2), poster: thumbFlower },
  { title: "Short film", src: clipSrc(3), poster: thumbShortA },
  { title: "Promo clip", src: clipSrc(4), poster: thumbPark },
  { title: "Reel", src: clipSrc(3), poster: thumbShortB },
];

export function WorkSection() {
  const [openName, setOpenName] = useState<string | null>(null);
  const open = workCategories.find((c) => c.name === openName) ?? null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenName(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {workCategories.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setOpenName(c.name)}
            className="rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary"
          >
            <span className="block text-sm font-medium">{c.name}</span>
            <span className="mt-1 block text-[11px] text-muted-foreground">
              {c.clips.length} sample clips
            </span>
          </button>
        ))}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.name}
          className="fixed inset-0 z-[60] flex flex-col bg-background/95"
        >
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h3 className="font-display text-xl">{open.name}</h3>
            <button
              type="button"
              onClick={() => setOpenName(null)}
              aria-label="Close"
              className="rounded-full border p-2 transition-colors hover:border-primary hover:text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 pb-28">
            {open.clips.map((clip) => (
              <figure key={clip.src} className="space-y-2">
                <video
                  src={clip.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full rounded-xl border bg-black"
                />
                <figcaption className="text-xs text-muted-foreground">
                  {open.name} · {clip.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
