import { describe, expect, it } from "vitest";
import { socialStats, formatCount } from "../lib/social-stats";

describe("social stats shown on Home graphs", () => {
  it("covers exactly Instagram @ig.fcpves and YouTube @KANNADABHAKTHIGEETHEYGALU", () => {
    expect(socialStats.map((s) => s.handle)).toEqual([
      "@ig.fcpves",
      "@KANNADABHAKTHIGEETHEYGALU",
    ]);
  });

  it("shows the exact saved figures, never invented ones", () => {
    const yt = socialStats.find((s) => s.platform === "YouTube");
    expect(yt?.metric).toBe("Subscribers");
    expect(yt?.value).toBe(1300);
    const ig = socialStats.find((s) => s.platform === "Instagram");
    expect(ig?.metric).toBe("Followers");
    expect(ig?.value).toBe(10000);
  });

  it("formats counts in compact form", () => {
    expect(formatCount(1300)).toBe("1.3K");
    expect(formatCount(2500000)).toBe("2.5M");
    expect(formatCount(842)).toBe("842");
  });
});
