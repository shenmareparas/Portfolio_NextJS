"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeSwitcher({ className }: { className?: string }) {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
        const newTheme = resolvedTheme === "dark" ? "light" : "dark";

        // @ts-ignore
        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        const x = e.clientX;
        const y = e.clientY;
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        // @ts-ignore
        const transition = document.startViewTransition(() => {
            setTheme(newTheme);
        });

        transition.ready.then(() => {
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`,
                    ],
                },
                {
                    duration: 500,
                    easing: "ease-in-out",
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        });
    };

    const CurrentIcon =
        (mounted && (resolvedTheme === "dark" ? Moon : Sun)) || Sun;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={toggleTheme}
                        className={cn(
                            "flex items-center justify-center rounded-full p-2 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20",
                            className
                        )}
                        aria-label="Toggle theme"
                    >
                        <CurrentIcon className="h-5 w-5" />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Theme</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
