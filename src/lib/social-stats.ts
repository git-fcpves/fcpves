// Social account figures shown on the Home graphs.
// These must always mirror the real accounts exactly.
// Update the numbers here whenever the real counts change.

export type SocialStat = {
  platform: string;
  handle: string;
  metric: string;
  value: number;
  href: string;
};

export const socialStats: SocialStat[] = [
  {
    platform: "Instagram",
    handle: "@ig.fcpves",
    metric: "Followers",
    value: 10000,
    href: "https://www.instagram.com/ig.fcpves",
  },
  {
    platform: "YouTube",
    handle: "@KANNADABHAKTHIGEETHEYGALU",
    metric: "Subscribers",
    value: 1300,
    href: "https://www.youtube.com/@KANNADABHAKTHIGEETHEYGALU",
  },
];

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}
