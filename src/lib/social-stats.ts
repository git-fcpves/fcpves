// Saved social figures for the Home graphs.
// The app reads the real accounts every 5 minutes; these are the figures
// shown before a live reading arrives and whenever a reading cannot be made.
// Keep them in step with the accounts whenever the real counts change.

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
    value: 10967,
    href: "https://www.instagram.com/ig.fcpves",
  },
  {
    platform: "YouTube",
    handle: "@KANNADABHAKTHIGEETHEYGALU",
    metric: "Subscribers",
    value: 1730,
    href: "https://www.youtube.com/@KANNADABHAKTHIGEETHEYGALU",
  },
  {
    platform: "YouTube",
    handle: "@yt.fcpves",
    metric: "Subscribers",
    value: 1300,
    href: "https://www.youtube.com/@yt.fcpves",
  },
];

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}
