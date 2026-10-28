import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Clapperboard, FolderOpen, Home, Send, User } from "lucide-react";

export const dockItems = [
  { id: "home", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: User },
  { id: "work", label: "Work", Icon: Clapperboard },
  { id: "projects", label: "Projects", Icon: FolderOpen },
  { id: "connect", label: "Connect", Icon: Send },
];

export function Dock({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const go = (id: string) => {
    onPick(id);
    if (id === "connect") {
      navigate({ to: "/connect" });
      return;
    }
    if (id === "projects") {
      navigate({ to: "/projects" });
      return;
    }
    if (id === "work") {
      navigate({ to: "/work" });
      return;
    }
    if (id === "about") {
      navigate({ to: "/about" });
      return;
    }
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      void navigate({ to: "/" }).then(() => window.scrollTo({ top: 0 }));
    }
  };

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-4 flex w-full max-w-sm items-stretch gap-1 rounded-full border border-tertiary bg-tertiary p-1.5 shadow-brand">
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
                on ? "bg-primary text-primary-foreground" : "text-secondary hover:text-primary-foreground"
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
