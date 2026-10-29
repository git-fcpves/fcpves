import { describe, expect, it } from "vitest";
import { categoryForTitle, groupByCategory, titleFromName, toGallery, VIDEO_REFRESH_MS, WORK_CATEGORIES } from "../lib/drive-videos";

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

describe("Work page shelves", () => {
  it("puts anything called AI in AI videos", () => {
    expect(categoryForTitle("AI VIDEO")).toBe("AI videos");
    expect(categoryForTitle("MOTION AI")).toBe("AI videos");
  });
  it("puts anything called a teaser in Teasers", () => {
    expect(categoryForTitle("WEDDING TEASER")).toBe("Teasers");
    expect(categoryForTitle("TEASER · DARSHINI PRAMUKH")).toBe("Teasers");
    expect(categoryForTitle("Reception Teaser")).toBe("Teasers");
  });
  it("keeps wedding films and every other film in Cinematic videos", () => {
    expect(categoryForTitle("Wedding Groom")).toBe("Cinematic videos");
    expect(categoryForTitle("MUHURTHAM REEL")).toBe("Cinematic videos");
    expect(categoryForTitle("Farmer")).toBe("Cinematic videos");
    expect(categoryForTitle("DAY 2 SHORT")).toBe("Cinematic videos");
  });
  it("never mistakes ai inside a longer word for an AI film", () => {
    expect(categoryForTitle("SAI LINGA")).toBe("Cinematic videos");
    expect(categoryForTitle("RAKSHITH")).toBe("Cinematic videos");
  });
  it("gives every shelf a list so none of them disappears", () => {
    const grouped = groupByCategory([
      { id: "a", title: "MOTION AI", src: "/x", poster: "/y" },
      { id: "b", title: "Teaser", src: "/x", poster: "/y" },
      { id: "c", title: "Wedding Groom", src: "/x", poster: "/y" },
    ]);
    expect(Object.keys(grouped)).toEqual([...WORK_CATEGORIES]);
    expect(grouped["AI videos"]?.map((v) => v.title)).toEqual(["MOTION AI"]);
    expect(grouped["Teasers"]?.map((v) => v.title)).toEqual(["Teaser"]);
    expect(grouped["Cinematic videos"]?.map((v) => v.title)).toEqual(["Wedding Groom"]);
    expect(grouped["Candid videos"]).toEqual([]);
  });
});
