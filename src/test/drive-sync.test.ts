import { afterEach, describe, expect, it, vi } from "vitest";

const video = { id: "1abcdefghijklmnopqrstuvwxyz", name: "sample.mp4", mimeType: "video/mp4", thumbnailLink: "https://example.com/thumb" };

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

async function setup() {
  vi.resetModules();
  vi.stubEnv("LOVABLE_API_KEY", "test");
  vi.stubEnv("GOOGLE_DRIVE_API_KEY", "test");
  vi.useFakeTimers();
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  return { fetcher, ...await import("../lib/drive.server") };
}

describe("Drive deletion sync", () => {
  it("removes a deleted video from the next five-minute snapshot and denies membership", async () => {
    const { fetcher, getGallery, isInFolder } = await setup();
    fetcher.mockResolvedValueOnce(Response.json({ files: [video] }));
    expect((await getGallery()).payload.videos.map((v) => v.id)).toEqual([video.id]);
    await vi.advanceTimersByTimeAsync(299999);
    expect((await getGallery()).payload.videos).toHaveLength(1);
    expect(fetcher).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    fetcher.mockResolvedValueOnce(Response.json({ files: [] }));
    expect((await getGallery()).payload.videos).toEqual([]);
    expect(await isInFolder(video.id)).toBe(false);
  });

  it("removes samples without a preview while retaining healthy videos", async () => {
    const { fetcher, getGallery } = await setup();
    fetcher.mockResolvedValueOnce(Response.json({ files: [video, { ...video, id: "2abcdefghijklmnopqrstuvwxyz", thumbnailLink: undefined }] }));
    expect((await getGallery()).payload.videos.map((v) => v.id)).toEqual([video.id]);
  });

  it("evicts confirmed unavailable videos from the shared snapshot", async () => {
    const { fetcher, getGallery, removeUnavailableVideo } = await setup();
    fetcher.mockResolvedValueOnce(Response.json({ files: [video] }));
    await getGallery();
    removeUnavailableVideo(video.id);
    expect((await getGallery()).payload.videos).toEqual([]);
    expect((await getGallery()).thumbs.has(video.id)).toBe(false);
  });
});