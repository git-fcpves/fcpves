import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

// Every content page is one step from Home, so Back always returns Home at the top.
export function BackButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Back"
      title="Back"
      className="mb-6 rounded-full text-accent"
      onClick={() => {
        void router.navigate({ to: "/" }).then(() => window.scrollTo({ top: 0 }));
      }}
    >
      <ArrowLeft />
    </Button>
  );
}
