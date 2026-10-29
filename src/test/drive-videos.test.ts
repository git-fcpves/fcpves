import { describe, expect, it } from "vitest";
import { titleFromName, toGallery, VIDEO_REFRESH_MS } from "../lib/drive-videos";

describe("Drive gallery", () => {
  it("refreshes every five minutes", () => {
    expect(VIDEO_REFRESH_MS).toBe(300000);
  });
  it("excludes deleted files", () => {
    expect(toGallery([{ id: "1abcdefghijklmnopqrstuvwxyz", name: "deleted.mp4", mimeType: "video/mp4", trashed: true }])).toEqual([]);
  });
  it("excludes empty videos", () => {
    expect(toGallery([{ id: "1abcdefghijklmnopqrstuvwxyz", name: "empty.mp4", mimeType: "video/mp4", size: "0" }])).toEqual([]);
  });
  it("excludes files Drive does not allow to stream", () => {
    expect(toGallery([{ id: "1abcdefghijklmnopqrstuvwxyz", name: "restricted.mp4", mimeType: "video/mp4", capabilities: { canDownload: false } }])).toEqual([]);
  });
  it("keeps only videos and never repeats a file", () => {
    const g = toGallery([
      { id: "1FTeGpgtf6YmLp1G2NCDumSqI44fCNxmW", name: "teaser.mp4", mimeType: "video/mp4" },
      { id: "1FTeGpgtf6YmLp1G2NCDumSqI44fCNxmW", name: "teaser.mp4", mimeType: "video/mp4" },
      { id: "1abcdefghijklmnopqrstuvwxyz", name: "notes.pdf", mimeType: "application/pdf" },
    ]);
    expect(g).toHaveLength(1);
  });
  it("plays through the site, never a Drive link", () => {
    const [v] = toGallery([{ id: "1FTeGpgtf6YmLp1G2NCDumSqI44fCNxmW", name: "teaser.mp4", mimeType: "video/mp4" }]);
    expect(v?.src).toBe("/api/public/video/1FTeGpgtf6YmLp1G2NCDumSqI44fCNxmW");
  });
  it("turns file names into titles without long dashes", () => {
    expect(titleFromName("pre wedding 1.mp4")).toBe("Pre Wedding 1");
    expect(titleFromName("TEASER - DARSHINI PRAMUKH.mp4")).toBe("TEASER · DARSHINI PRAMUKH");
  });
});
