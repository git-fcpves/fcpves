import { describe, expect, it } from "vitest";
import { socialStats, formatCount } from "../lib/social-stats";

describe("social stats shown on Home graphs", () => {
  it("covers Instagram @ig.fcpves and both YouTube channels", () => {
    expect(socialStats.map((s) => s.handle)).toEqual([
      "@ig.fcpves",
      "@KANNADABHAKTHIGEETHEYGALU",
      "@yt.fcpves",
    ]);
  });

  it("holds the latest real figures as the fallback reading", () => {
    const byHandle = Object.fromEntries(socialStats.map((s) => [s.handle, s] as const));
    expect(byHandle["@ig.fcpves"]?.metric).toBe("Followers");
    expect(byHandle["@ig.fcpves"]?.value).toBe(10967);
    expect(byHandle["@KANNADABHAKTHIGEETHEYGALU"]?.metric).toBe("Subscribers");
    expect(byHandle["@KANNADABHAKTHIGEETHEYGALU"]?.value).toBe(1730);
    expect(byHandle["@yt.fcpves"]?.metric).toBe("Subscribers");
    expect(byHandle["@yt.fcpves"]?.value).toBe(1300);
  });

  it("formats counts in compact form", () => {
    expect(formatCount(1300)).toBe("1.3K");
    expect(formatCount(2500000)).toBe("2.5M");
    expect(formatCount(842)).toBe("842");
  });
});
