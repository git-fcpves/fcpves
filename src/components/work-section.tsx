import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { VideoPreview, type VideoClip } from "./video-preview";
import { driveVideosQueryOptions } from "../lib/drive-videos";

type Category = { name: string; clips: VideoClip[] };

// Every category shows the videos from the Google Drive folder until they are sorted.
export const CATEGORY_NAMES = [
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

export function useGalleryVideos() {
  const { data, isPending, isError } = useQuery(driveVideosQueryOptions());
  return { videos: data?.videos ?? [], isPending, isError: isError || data?.ok === false };
}

export function WorkSection() {
  const { videos } = useGalleryVideos();
  const categories: Category[] = CATEGORY_NAMES.map((name) => ({
    name,
    clips: name === "Cinematic videos" ? videos : [],
  }));
  const [openName, setOpenName] = useState<string | null>(null);
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
  const open = categories.find((c) => c.name === openName) ?? null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !selectedClip) setOpenName(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, selectedClip]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((c) => (
          <Button
            variant="ghost"
            key={c.name}
            type="button"
            onClick={() => setOpenName(c.name)}
            className="block h-auto whitespace-normal rounded-xl border bg-card p-4 text-left card-hover"
          >
            <span className="block text-sm font-medium">{c.name}</span>
            <span className="mt-1 block text-[11px] text-muted-foreground">
              {c.clips.length > 0 ? `${c.clips.length} films` : "Coming soon"}
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
            {open.clips.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">Films for this category are coming soon.</p>
            )}
            {open.clips.map((clip) => (
              <figure key={clip.src} className="space-y-2">
                <Button
                  variant="ghost"
                  aria-label={`Play ${clip.title}`}
                  onClick={() => setSelectedClip(clip)}
                  className="group block h-auto w-full overflow-hidden rounded-lg border p-0 card-hover"
                >
                  <img
                    src={clip.poster}
                    alt={clip.title}
                    loading="lazy"
                    draggable={false}
                    width={720}
                    height={405}
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Button>
                <figcaption className="text-xs text-muted-foreground">{clip.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
      <VideoPreview clip={selectedClip} onClose={() => setSelectedClip(null)} />
    </>
  );
}
