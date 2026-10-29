import { useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";

export type VideoClip = { title: string; src: string; poster?: string; href?: string };

const SPOTS = ["left-[6%] top-[8%]", "right-[6%] top-[8%]", "right-[6%] bottom-[18%]", "left-[6%] bottom-[18%]"];

export function VideoPreview({ clip, onClose }: { clip: VideoClip | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [spot, setSpot] = useState(0);
  const [failed, setFailed] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const session = useMemo(() => Math.random().toString(36).slice(2, 8).toUpperCase(), []);

  useEffect(() => {
    if (!clip) return;
    setFailed(false);
    setBuffering(true);
    const video = videoRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setInterval(() => setSpot((s) => (s + 1) % SPOTS.length), 8000);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearInterval(t);
      // Release the old stream so it cannot compete with the next selected film.
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [clip?.src]);

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
            ref={videoRef}
            key={clip.src}
            src={clip.src}
            poster={clip.poster}
            controls
            autoPlay
            playsInline
            preload="auto"
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            onWaiting={() => setBuffering(true)}
            onSeeking={() => setBuffering(true)}
            onPlaying={() => setBuffering(false)}
            onCanPlay={() => setBuffering(false)}
            onPause={() => setBuffering(false)}
            onError={() => {
              setFailed(true);
              setBuffering(false);
              // A codec failure is not evidence of a deleted file. Check the server first.
              void fetch(clip.src, { headers: { Range: "bytes=0-0" } }).then(async (res) => {
                await res.body?.cancel();
                if (res.status === 404 || res.status === 410) {
                  await queryClient.invalidateQueries({ queryKey: ["drive-videos"] });
                  onClose();
                }
              }).catch(() => {});
            }}
            className="aspect-video w-full rounded-lg border bg-background"
          />
          {buffering && !failed && (
            <div role="status" aria-label="Buffering video" className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary motion-reduce:animate-none" aria-hidden="true" />
            </div>
          )}
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
