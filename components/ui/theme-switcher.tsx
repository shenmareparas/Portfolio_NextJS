"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useMobileHaptics } from "@/hooks/use-mobile-haptics";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeSwitcher({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const haptic = useMobileHaptics();

  const toggleTheme = () => {
    haptic.trigger("light");
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: ["inset(0 0 100% 0)", "inset(0 0 0 0)"],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              "flex items-center justify-center rounded-full p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              className,
            )}
            aria-label="Toggle theme (t)"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Theme{" "}
            <kbd className="ml-1 text-[10px] opacity-70 font-mono px-1 py-0.5 rounded bg-muted">
              T
            </kbd>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
