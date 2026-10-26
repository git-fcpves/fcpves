import { createFileRoute } from "@tanstack/react-router";
import {
  audienceSources,
  parseInstagramFollowers,
  parseSubscribers,
  type AudiencePayload,
  type AudienceSource,
  type AudienceStat,
} from "@/lib/audience-sources";
import { socialStats } from "@/lib/social-stats";

const REFRESH_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const INSTAGRAM_APP_ID = "936619743392459";

const NO_STORE = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

// One shared reading for every visitor, reused for 5 minutes.
let cached: { at: number; payload: AudiencePayload } | null = null;
let inflight: Promise<AudiencePayload> | null = null;

async function readText(url: string, headers: Record<string, string> = {}): Promise<string> {
  const res = await fetch(url, {
    headers: { "user-agent": USER_AGENT, ...headers },
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`upstream responded ${res.status}`);
  return res.text();
}

async function readStat(source: AudienceSource): Promise<AudienceStat> {
  const base = {
    platform: source.platform,
    handle: source.handle,
    metric: source.metric,
    href: source.href,
  };
  const saved = socialStats.find((s) => s.handle === source.handle)?.value ?? 0;
  try {
    const value =
      source.kind === "instagram"
        ? parseInstagramFollowers(
            JSON.parse(await readText(source.url, { "x-ig-app-id": INSTAGRAM_APP_ID })),
          )
        : parseSubscribers(await readText(source.url));
    if (value === null) throw new Error("count not present");
    return { ...base, value, live: true };
  } catch {
    return { ...base, value: saved, live: false };
  }
}

async function buildPayload(): Promise<AudiencePayload> {
  const stats = await Promise.all(audienceSources.map(readStat));
  return { stats, fetchedAt: new Date().toISOString(), refreshMs: REFRESH_MS };
}

export const Route = createFileRoute("/api/public/audience")({
  server: {
    handlers: {
      GET: async () => {
        const now = Date.now();
        if (cached && now - cached.at < REFRESH_MS) {
          return Response.json(cached.payload, { headers: NO_STORE });
        }
        if (!inflight) {
          inflight = buildPayload()
            .then((payload) => {
              cached = { at: Date.now(), payload };
              return payload;
            })
            .finally(() => {
              inflight = null;
            });
        }
        return Response.json(await inflight, { headers: NO_STORE });
      },
    },
  },
});
