import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export function BackButton() {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Back"
      title="Back"
      className="mb-6 rounded-full text-accent"
      onClick={() => {
        if (canGoBack) {
          router.history.back();
        } else {
          void router.navigate({ to: "/" });
        }
      }}
    >
      <ArrowLeft />
    </Button>
  );
}