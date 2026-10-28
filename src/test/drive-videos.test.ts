import { describe, expect, it } from "vitest";
import { titleFromName, toGallery } from "../lib/drive-videos";

describe("Drive gallery", () => {
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
