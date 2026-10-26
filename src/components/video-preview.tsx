import { useEffect } from "react";
import { X } from "lucide-react";

export type VideoClip = { title: string; src: string; poster?: string };

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
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full border p-2 transition-colors hover:border-primary hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3 px-5 py-5 pb-28">
        <video
          src={clip.src}
          poster={clip.poster}
          controls
          autoPlay
          playsInline
          className="w-full rounded-xl border bg-black"
        />
        <p className="text-xs text-muted-foreground">{clip.title}</p>
      </div>
    </div>
  );
}
