import { describe, expect, it } from "vitest";
import {
  audienceSources,
  parseCompactNumber,
  parseInstagramFollowers,
  parseSubscribers,
} from "../lib/audience-sources";
import { REFRESH_MS, fallbackPayload } from "../lib/audience";
import { socialStats } from "../lib/social-stats";

describe("audience figures refresh automatically", () => {
  it("re-reads the accounts every 5 minutes", () => {
    expect(REFRESH_MS).toBe(300000);
  });

  it("reads the exact count from each saved figure when live data is missing", () => {
    expect(fallbackPayload.stats.map((s) => s.handle)).toEqual(
      socialStats.map((s) => s.handle),
    );
    expect(fallbackPayload.stats.map((s) => s.value)).toEqual(
      socialStats.map((s) => s.value),
    );
    expect(fallbackPayload.stats.every((s) => s.live === false)).toBe(true);
  });
});

describe("live count readers", () => {
  it("reads YouTube channel pages", () => {
    expect(parseSubscribers('{"content":"1.73K subscribers"}')).toBe(1730);
    expect(parseSubscribers("<p>1.3K subscribers</p>")).toBe(1300);
    expect(parseSubscribers("no count here")).toBeNull();
  });

  it("reads the Instagram follower count", () => {
    expect(
      parseInstagramFollowers({ data: { user: { edge_followed_by: { count: 10967 } } } }),
    ).toBe(10967);
    expect(parseInstagramFollowers({ data: { user: {} } })).toBeNull();
    expect(parseInstagramFollowers(null)).toBeNull();
  });

  it("converts compact figures", () => {
    expect(parseCompactNumber("10,967")).toBe(10967);
    expect(parseCompactNumber("2.5M")).toBe(2500000);
    expect(parseCompactNumber("842")).toBe(842);
    expect(parseCompactNumber("")).toBeNull();
  });

  it("points at the accounts Sagar supplied", () => {
    expect(audienceSources.map((s) => s.href)).toEqual([
      "https://www.instagram.com/ig.fcpves",
      "https://www.youtube.com/@KANNADABHAKTHIGEETHEYGALU",
      "https://www.youtube.com/@yt.fcpves",
    ]);
  });
});
