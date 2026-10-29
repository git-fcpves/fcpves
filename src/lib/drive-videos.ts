import { queryOptions } from "@tanstack/react-query";

// The Google Drive folder that feeds the gallery. Only videos directly inside it are shown.
export const DRIVE_FOLDER_ID = "1FhYvffe8qS2FgewVCFHhz88rcwlnw0OR";
export const VIDEO_REFRESH_MS = 5 * 60 * 1000;

export type DriveFile = { id: string; name: string; mimeType: string; modifiedTime?: string; trashed?: boolean; size?: string; capabilities?: { canDownload?: boolean } };
export type DriveVideo = { id: string; title: string; src: string; poster: string; modifiedTime?: string | undefined };
export type DriveVideosPayload = { videos: DriveVideo[]; syncedAt: string; ok: boolean };

const DRIVE_ID = /^[A-Za-z0-9_-]{10,100}$/;
export const isDriveId = (id: string) => DRIVE_ID.test(id);

// "pre wedding 1.mp4" becomes "Pre Wedding 1".
export function titleFromName(name: string): string {
  const base = name.replace(/\.[a-z0-9]{2,4}$/i, "").replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
  return base
    .split(" ")
    .map((w) => (w === w.toUpperCase() ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ")
    .replace(/\s*[\u2013\u2014]\s*/g, " · ")
    .replace(/\s+-\s+/g, " · ");
}

// Drive entries become gallery tiles: videos only, one tile per stable file ID, newest first.
export function toGallery(files: DriveFile[]): DriveVideo[] {
  const seen = new Set<string>();
  return files
    .filter((f) => f.mimeType.startsWith("video/") && isDriveId(f.id) && !f.trashed && f.size !== "0" && f.capabilities?.canDownload !== false)
    .filter((f) => (seen.has(f.id) ? false : (seen.add(f.id), true)))
    .sort((a, b) => (b.modifiedTime ?? "").localeCompare(a.modifiedTime ?? ""))
    .map((f) => ({
      id: f.id,
      title: titleFromName(f.name),
      src: `/api/public/video/${f.id}`,
      poster: `/api/public/thumb/${f.id}`,
      modifiedTime: f.modifiedTime,
    }));
}

export function driveVideosQueryOptions() {
  return queryOptions({
    queryKey: ["drive-videos"],
    queryFn: async (): Promise<DriveVideosPayload> => {
      const res = await fetch("/api/public/videos", { headers: { accept: "application/json" } });
      if (!res.ok) throw new Error("videos unavailable");
      return res.json();
    },
    staleTime: 0,
    refetchInterval: (query) => {
      const synced = Date.parse(query.state.data?.syncedAt ?? "");
      return Number.isFinite(synced) ? Math.max(1000, VIDEO_REFRESH_MS - (Date.now() - synced)) : VIDEO_REFRESH_MS;
    },
    refetchOnWindowFocus: "always",
  });
}
