import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

export type VideoClip = { title: string; src: string; poster?: string; href?: string };

const SPOTS = ["left-[6%] top-[8%]", "right-[6%] top-[8%]", "right-[6%] bottom-[18%]", "left-[6%] bottom-[18%]"];

export function VideoPreview({ clip, onClose }: { clip: VideoClip | null; onClose: () => void }) {
  const [spot, setSpot] = useState(0);
  const [failed, setFailed] = useState(false);
  const session = useMemo(() => Math.random().toString(36).slice(2, 8).toUpperCase(), []);

  useEffect(() => {
    if (!clip) return;
    setFailed(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setInterval(() => setSpot((s) => (s + 1) % SPOTS.length), 8000);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearInterval(t);
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
      className="fixed inset-0 z-[60] flex select-none flex-col bg-background/95"
    >
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h3 className="font-display text-xl">{clip.title}</h3>
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full border p-2 transition-colors hover:border-border hover:text-accent"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3 px-5 py-5 pb-28">
        <div className="relative mx-auto w-full max-w-4xl" onContextMenu={(e) => e.preventDefault()}>
          <video
            key={clip.src}
            src={clip.src}
            poster={clip.poster}
            controls
            autoPlay
            playsInline
            preload="metadata"
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            onError={() => setFailed(true)}
            className="aspect-video w-full rounded-lg border bg-background"
          />
          <span
            aria-hidden
            className={`pointer-events-none absolute ${SPOTS[spot]} text-[10px] tracking-widest text-foreground/40 transition-all duration-1000`}
          >
            © FCPVES · {session}
          </span>
        </div>
        <p className="mx-auto text-center text-xs text-muted-foreground">
          {failed ? "This film could not start. Please try again in a moment." : clip.title}
        </p>
      </div>
    </div>
  );
}
