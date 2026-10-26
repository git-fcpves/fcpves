// Live audience figures: where each number comes from and how it is read.
// The app asks for these counts every 5 minutes and falls back to the
// saved figures in social-stats.ts whenever a source cannot be reached.

export type AudienceStat = {
  platform: string;
  handle: string;
  metric: string;
  value: number;
  href: string;
  live: boolean;
};

export type AudiencePayload = {
  stats: AudienceStat[];
  fetchedAt: string;
  refreshMs: number;
};

export type AudienceSource = {
  platform: string;
  handle: string;
  metric: string;
  href: string;
  url: string;
  kind: "instagram" | "youtube";
};

export const audienceSources: AudienceSource[] = [
  {
    platform: "Instagram",
    handle: "@ig.fcpves",
    metric: "Followers",
    href: "https://www.instagram.com/ig.fcpves",
    url: "https://i.instagram.com/api/v1/users/web_profile_info/?username=ig.fcpves",
    kind: "instagram",
  },
  {
    platform: "YouTube",
    handle: "@KANNADABHAKTHIGEETHEYGALU",
    metric: "Subscribers",
    href: "https://www.youtube.com/@KANNADABHAKTHIGEETHEYGALU",
    url: "https://www.youtube.com/@KANNADABHAKTHIGEETHEYGALU",
    kind: "youtube",
  },
  {
    platform: "YouTube",
    handle: "@yt.fcpves",
    metric: "Subscribers",
    href: "https://www.youtube.com/@yt.fcpves",
    url: "https://www.youtube.com/@yt.fcpves",
    kind: "youtube",
  },
];

// "1.73K", "10,967", "842" -> 1730, 10967, 842
export function parseCompactNumber(raw: string): number | null {
  const match = raw.trim().match(/^([0-9][0-9.,]*)\s*([KMB])?$/i);
  if (!match) return null;
  const base = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(base)) return null;
  const suffix = (match[2] || "").toUpperCase();
  const multipliers: Record<string, number> = { K: 1_000, M: 1_000_000, B: 1_000_000_000 };
  return Math.round(base * (multipliers[suffix] ?? 1));
}

// Channel pages show the count as "1.73K subscribers".
export function parseSubscribers(html: string): number | null {
  const match = html.match(/([0-9][0-9.,]*\s*[KMB]?)\s+subscribers/i);
  return match ? parseCompactNumber(match[1]) : null;
}

export function parseInstagramFollowers(json: unknown): number | null {
  const count = (
    json as { data?: { user?: { edge_followed_by?: { count?: unknown } } } }
  )?.data?.user?.edge_followed_by?.count;
  if (typeof count !== "number" || !Number.isFinite(count) || count < 0) return null;
  return Math.round(count);
}
