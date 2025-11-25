"use client";

import * as React from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({ className }: { className?: string }) {
    const { setTheme, theme } = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const themes = [
        { name: "light", icon: Sun, label: "Light" },
        { name: "dark", icon: Moon, label: "Dark" },
        { name: "system", icon: Palette, label: "System" },
    ];

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const CurrentIcon =
        (mounted && themes.find((t) => t.name === theme)?.icon) || Sun;

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Switch theme"
                aria-expanded={isOpen}
            >
                <CurrentIcon className="h-5 w-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-2 w-36 origin-top-right rounded-lg border border-border bg-popover p-1 shadow-lg backdrop-blur-sm"
                    >
                        <div className="flex flex-col gap-1">
                            {themes.map((t) => {
                                const Icon = t.icon;
                                const isActive = theme === t.name;
                                return (
                                    <button
                                        key={t.name}
                                        onClick={() => {
                                            setTheme(t.name);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-accent text-accent-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{t.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
