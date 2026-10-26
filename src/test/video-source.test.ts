import { describe, expect, it } from "vitest";
import { youtubeEmbedUrl } from "../lib/video-source";

describe("Portfolio in-app video sources", () => {
  it.each([
    ["https://youtu.be/er1WXxV_5KA", "er1WXxV_5KA"],
    ["https://youtu.be/0ASm37QZjdc", "0ASm37QZjdc"],
    ["https://youtu.be/rJB3l8hkYB0", "rJB3l8hkYB0"],
  ])("embeds the supplied film %s rather than redirecting", (href, id) => {
    expect(youtubeEmbedUrl(href)).toBe(
      `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`,
    );
  });

  it("keeps local samples on the native video player", () => {
    expect(youtubeEmbedUrl(undefined)).toBeNull();
  });
});