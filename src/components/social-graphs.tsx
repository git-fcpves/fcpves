import { socialStats, formatCount, type SocialStat } from "../lib/social-stats";

function Bar({ stat, max }: { stat: SocialStat; max: number }) {
  const pct = max > 0 ? Math.max((stat.value / max) * 100, stat.value > 0 ? 4 : 0) : 0;
  return (
    <a
      href={stat.href}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border bg-card p-4 transition-colors hover:border-border"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm">{stat.platform}</span>
        <span className="font-display text-xl text-primary">{formatCount(stat.value)}</span>
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">
        {stat.handle} · {stat.metric}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="img"
          aria-label={`${stat.platform} ${stat.metric}: ${stat.value}`}
        />
      </div>
    </a>
  );
}

function Donut({ stat, share }: { stat: SocialStat; share: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const filled = Math.min(Math.max(share, 0), 1) * c;
  return (
    <a
      href={stat.href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col items-center rounded-xl border bg-card p-4 transition-colors hover:border-border"
    >
      <svg viewBox="0 0 96 96" className="h-24 w-24" role="img" aria-label={`${stat.platform} share of total audience`}>
        <circle cx="48" cy="48" r={r} fill="none" strokeWidth="10" className="stroke-secondary" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className="stroke-primary"
          strokeDasharray={`${filled} ${c - filled}`}
          transform="rotate(-90 48 48)"
        />
        <text x="48" y="52" textAnchor="middle" className="fill-foreground text-[15px] font-bold">
          {Math.round(share * 100)}%
        </text>
      </svg>
      <span className="mt-2 text-sm">{stat.platform}</span>
      <span className="text-[11px] text-muted-foreground">{formatCount(stat.value)}</span>
    </a>
  );
}

export function SocialGraphs() {
  const max = Math.max(...socialStats.map((s) => s.value), 1);
  const total = socialStats.reduce((sum, s) => sum + s.value, 0);
  return (
    <div className="space-y-3">
      {socialStats.map((s) => (
        <Bar key={s.platform} stat={s} max={max} />
      ))}
      <div className="grid grid-cols-2 gap-3">
        {socialStats.map((s) => (
          <Donut key={s.platform} stat={s} share={total > 0 ? s.value / total : 0} />
        ))}
      </div>
    </div>
  );
}
