"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";
import { Home, FolderCode, User, Send } from "lucide-react";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Projects", href: "/projects", icon: FolderCode },
    { name: "About", href: "/about", icon: User },
    { name: "Contact", href: "/contact", icon: Send },
];

export function Header() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
    }, []);

    return (
        <>
            <motion.header className="fixed top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/95 border-border/40">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
                    <div className="flex items-center gap-2 z-50">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 cursor-hover"
                        >
                            <span className="text-xl font-bold">
                                Paras Shenmare
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary cursor-hover",
                                    pathname === item.href
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                <AnimatePresence>
                                    {pathname === item.href && (
                                        <motion.span
                                            key="navbar-active"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute inset-0 z-0 bg-secondary rounded-full"
                                        />
                                    )}
                                </AnimatePresence>
                                <span className="relative z-10">
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4 z-50">
                        <ThemeSwitcher />
                    </div>
                </div>
            </motion.header>

            {/* Mobile Bottom Tab Bar */}
            {mounted &&
                createPortal(
                    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40">
                            <div className="flex items-center justify-around h-16 px-2">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "relative flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors",
                                                isActive
                                                    ? "text-primary"
                                                    : "text-muted-foreground"
                                            )}
                                        >
                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.span
                                                        key="bottom-tab-active"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{
                                                            duration: 0.2,
                                                        }}
                                                        className="absolute inset-x-2 top-1 bottom-1 z-0 bg-primary/10 rounded-xl"
                                                    />
                                                )}
                                            </AnimatePresence>
                                            <Icon
                                                className={cn(
                                                    "relative z-10 w-5 h-5 mb-1 transition-transform",
                                                    isActive && "scale-110"
                                                )}
                                            />
                                            <span
                                                className={cn(
                                                    "relative z-10 text-xs font-medium transition-all",
                                                    isActive && "font-semibold"
                                                )}
                                            >
                                                {item.name}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                            {/* Safe area padding for devices with home indicator */}
                            <div className="h-[env(safe-area-inset-bottom)]" />
                        </div>
                    </nav>,
                    document.body
                )}
        </>
    );
}
