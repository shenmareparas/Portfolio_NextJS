"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({ className }: { className?: string }) {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    const CurrentIcon =
        (mounted && (resolvedTheme === "dark" ? Moon : Sun)) || Sun;

    return (
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
    );
}
