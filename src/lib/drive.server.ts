import { DRIVE_FOLDER_ID, VIDEO_REFRESH_MS, toGallery, type DriveFile, type DriveVideosPayload } from "./drive-videos";

const GATEWAY = "https://connector-gateway.lovable.dev/google_drive/drive/v3";

export function driveHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const lovable = process.env["LOVABLE_API_KEY"];
  const drive = process.env["GOOGLE_DRIVE_API_KEY"];
  if (!lovable || !drive) throw new Error("Google Drive is not connected");
  return { Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": drive, ...extra };
}

export const driveUrl = (path: string) => `${GATEWAY}${path}`;

type Listing = { files: (DriveFile & { thumbnailLink?: string })[]; nextPageToken?: string };

// One shared reading of the folder for every visitor, renewed every 5 minutes.
type Gallery = { at: number; payload: DriveVideosPayload; thumbs: Map<string, string> };
let cached: Gallery | null = null;
let inflight: Promise<Gallery> | null = null;

async function listFolder(): Promise<Listing["files"]> {
  const all: Listing["files"] = [];
  let pageToken: string | undefined;
  do {
    const q = new URLSearchParams({
      q: `'${DRIVE_FOLDER_ID}' in parents and trashed=false and mimeType contains 'video/'`,
      fields: "nextPageToken,files(id,name,mimeType,modifiedTime,thumbnailLink)",
      pageSize: "1000",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    });
    if (pageToken) q.set("pageToken", pageToken);
    const res = await fetch(driveUrl(`/files?${q}`), { headers: driveHeaders() });
    if (!res.ok) throw new Error(`Drive listing failed [${res.status}]: ${await res.text()}`);
    const body = (await res.json()) as Listing;
    all.push(...body.files);
    pageToken = body.nextPageToken;
  } while (pageToken);
  return all;
}

export async function getGallery(): Promise<Gallery> {
  if (cached && Date.now() - cached.at < VIDEO_REFRESH_MS) return cached;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      let files: Listing["files"];
      try {
        files = await listFolder();
      } catch {
        await new Promise((r) => setTimeout(r, 1500));
        files = await listFolder();
      }
      const thumbs = new Map<string, string>();
      for (const f of files) if (f.thumbnailLink) thumbs.set(f.id, f.thumbnailLink);
      cached = {
        at: Date.now(),
        payload: { videos: toGallery(files), syncedAt: new Date().toISOString(), ok: true },
        thumbs,
      };
      return cached;
    } catch (error) {
      console.error(error);
      // Keep showing the last good reading if Drive fails.
      if (cached) return cached;
      return { at: 0, payload: { videos: [], syncedAt: "", ok: false }, thumbs: new Map<string, string>() };
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export async function isInFolder(id: string): Promise<boolean> {
  const g = await getGallery();
  return g.payload.videos.some((v) => v.id === id);
}
