import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Clip = { title: string; src: string };
type Category = { name: string; clips: Clip[] };

const SOURCES = [
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://vjs.zencdn.net/v/oceans.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  "https://filesamples.com/samples/video/mp4/sample_640x360.mp4",
  "https://media.w3.org/2010/05/bunny/trailer.mp4",
  "https://media.w3.org/2010/05/video/movie_300.mp4",
  "https://download.samplelib.com/mp4/sample-5s.mp4",
  "https://download.samplelib.com/mp4/sample-10s.mp4",
];

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
    { title: "Sample clip 1", src: SOURCES[(i * 2) % SOURCES.length] },
    { title: "Sample clip 2", src: SOURCES[(i * 2 + 1) % SOURCES.length] },
  ],
}));

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
                  {open.name} — {clip.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
