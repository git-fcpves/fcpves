import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { youtubeEmbedUrl } from "../lib/video-source";

export type VideoClip = { title: string; src: string; poster?: string; href?: string };

export function VideoPreview({
  clip,
  onClose,
}: {
  clip: VideoClip | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!clip) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [clip, onClose]);

  if (!clip) return null;
  const embedUrl = youtubeEmbedUrl(clip.href);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={clip.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[60] flex flex-col bg-background/95"
    >
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h3 className="font-display text-xl">{clip.title}</h3>
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full border p-2 transition-colors hover:border-border hover:text-primary"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3 px-5 py-5 pb-28">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={clip.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="mx-auto aspect-video w-full max-w-4xl rounded-lg border bg-background"
          />
        ) : (
          <video
          src={clip.src}
          poster={clip.poster}
          controls
          autoPlay
          playsInline
          className="mx-auto aspect-video w-full max-w-4xl rounded-lg border bg-background"
        />
        )}
        <p className="text-xs text-muted-foreground">{clip.title}</p>
      </div>
    </div>
  );
}
