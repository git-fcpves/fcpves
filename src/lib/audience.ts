import { queryOptions } from "@tanstack/react-query";
import { socialStats } from "./social-stats";
import type { AudiencePayload } from "./audience-sources";

// The Audience graphs refresh themselves on this interval.
export const REFRESH_MS = 5 * 60 * 1000;

// Saved figures, shown first and used again if a live reading fails.
export const fallbackPayload: AudiencePayload = {
  stats: socialStats.map((s) => ({ ...s, live: false })),
  fetchedAt: "",
  refreshMs: REFRESH_MS,
};

export function audienceQueryOptions() {
  return queryOptions({
    queryKey: ["audience"],
    queryFn: async (): Promise<AudiencePayload> => {
      const res = await fetch("/api/public/audience", {
        headers: { accept: "application/json" },
      });
      if (!res.ok) throw new Error("audience figures unavailable");
      return res.json();
    },
    placeholderData: () => fallbackPayload,
    staleTime: REFRESH_MS,
    refetchInterval: REFRESH_MS,
    refetchOnWindowFocus: true,
  });
}
