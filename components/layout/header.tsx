"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Experience", href: "/experience" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2 z-50">
                    <Link
                        href="/"
                        className="flex items-center space-x-2 cursor-hover"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <span className="text-xl font-bold">
                            Paras Shenmare
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary cursor-hover",
                                pathname === item.href
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <ThemeSwitcher />
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center md:hidden gap-4 z-50">
                    <ThemeSwitcher />
                    <button
                        className="p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm md:hidden"
                            >
                                <button
                                    className="absolute top-4 right-4 p-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                                <nav className="flex flex-col items-center gap-8 p-4">
                                    {navItems.map((item, index) => (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                delay: index * 0.1 + 0.1,
                                            }}
                                        >
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "text-2xl font-medium transition-colors hover:text-primary",
                                                    pathname === item.href
                                                        ? "text-foreground"
                                                        : "text-muted-foreground"
                                                )}
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                            >
                                                {item.name}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </header>
    );
}
