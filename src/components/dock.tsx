import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Briefcase, Clapperboard, Home, Send, User } from "lucide-react";

export const dockItems = [
  { id: "home", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: User },
  { id: "work", label: "Work", Icon: Clapperboard },
  { id: "experience", label: "Jobs", Icon: Briefcase },
  { id: "connect", label: "Connect", Icon: Send },
];

export function Dock({ active }: { active: string }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const go = (id: string) => {
    if (id === "connect") {
      navigate({ to: "/connect" });
      return;
    }
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (!el) return;
      const top = id === "home" ? 0 : el.getBoundingClientRect().top + window.scrollY - 16;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      navigate({ to: "/", search: { to: id } });
    }
  };

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-4 flex w-full max-w-sm items-stretch gap-1 rounded-full border bg-card p-1.5 shadow-[0_-6px_30px_rgba(0,0,0,0.55)]">
        {dockItems.map(({ id, label, Icon }) => {
          const on = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              aria-label={label}
              aria-current={on ? "true" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 rounded-full py-2 transition-colors duration-200 ${
                on ? "bg-primary/15 text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={on ? 2.2 : 1.6} />
              <span className="text-[9px] tracking-wide">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
