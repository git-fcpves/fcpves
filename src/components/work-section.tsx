import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { VideoPreview, type VideoClip } from "./video-preview";
import clip1 from "../assets/sample-filesamples.mp4.asset.json";
import clip2 from "../assets/sample-testvideos.mp4.asset.json";
import clip3 from "../assets/sample-mdn.mp4.asset.json";
import clip4 from "../assets/sample-w3.mp4.asset.json";
import clip5 from "../assets/sample-samplelib.mp4.asset.json";
import thumbFlower from "../assets/thumb-mdn.jpg";
import thumbPark from "../assets/thumb-samplelib.jpg";
import thumbShortA from "../assets/thumb-w3a.jpg";
import thumbShortB from "../assets/thumb-w3b.jpg";
import thumbRooted from "../assets/thumb-rooted-in-love.jpg";
import thumbModern from "../assets/thumb-modern-love.jpg";

type Clip = VideoClip;
type Category = { name: string; clips: Clip[] };
export type Featured = { title: string; src: string; poster: string; href?: string };

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

export const featuredWork: Featured[] = [
  {
    title: "Rooted in Love",
    src: clipSrc(0),
    poster: thumbRooted,
    href: "https://youtu.be/er1WXxV_5KA",
  },
  {
    title: "Modern Love",
    src: clipSrc(1),
    poster: thumbModern,
    href: "https://youtu.be/0ASm37QZjdc",
  },
  {
    title: "Vintage Love",
    src: clipSrc(2),
    poster: thumbFlower,
    href: "https://youtu.be/rJB3l8hkYB0",
  },
  { title: "Short film", src: clipSrc(3), poster: thumbShortA },
  { title: "Promo clip", src: clipSrc(4), poster: thumbPark },
  { title: "Reel", src: clipSrc(3), poster: thumbShortB },
];

export const workCategories: Category[] = NAMES.map((name, i) => ({
  name,
  clips: name === "Cinematic videos" ? featuredWork.slice(0, 3) : [
    { title: "Sample clip 1", src: clipSrc(i * 2) },
    { title: "Sample clip 2", src: clipSrc(i * 2 + 1) },
  ],
}));

export function WorkSection() {
  const [openName, setOpenName] = useState<string | null>(null);
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
  const open = workCategories.find((c) => c.name === openName) ?? null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !selectedClip) setOpenName(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open, selectedClip]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {workCategories.map((c) => (
          <Button
            variant="ghost"
            key={c.name}
            type="button"
            onClick={() => setOpenName(c.name)}
            className="block h-auto whitespace-normal rounded-xl border bg-card p-4 text-left transition-colors hover:border-border"
          >
            <span className="block text-sm font-medium">{c.name}</span>
            <span className="mt-1 block text-[11px] text-muted-foreground">
              {c.clips.length} {c.name === "Cinematic videos" ? "films" : "sample clips"}
            </span>
          </Button>
        ))}
      </div>

      {open && !selectedClip && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.name}
          className="fixed inset-0 z-[60] flex flex-col bg-background/95"
        >
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h3 className="font-display text-xl">{open.name}</h3>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => setOpenName(null)}
              aria-label="Close"
              className="rounded-full border p-2 transition-colors hover:border-border hover:text-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 pb-28">
            {open.clips.map((clip) => (
              <figure key={clip.href ?? clip.src} className="space-y-2">
                {clip.href ? (
                  <Button
                    variant="ghost"
                    aria-label={`Play ${clip.title}`}
                    onClick={() => setSelectedClip(clip)}
                    className="block h-auto w-full overflow-hidden rounded-lg border p-0"
                  >
                    <img src={clip.poster} alt={clip.title} className="aspect-video w-full object-cover" />
                  </Button>
                ) : (
                  <video
                  src={clip.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full rounded-xl border bg-background"
                />
                )}
                <figcaption className="text-xs text-muted-foreground">
                  {open.name} · {clip.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
      <VideoPreview clip={selectedClip} onClose={() => setSelectedClip(null)} />
    </>
  );
}
