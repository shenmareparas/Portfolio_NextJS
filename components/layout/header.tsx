"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
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

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <motion.header
            className={cn(
                "fixed top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60",
                isMobileMenuOpen
                    ? "bg-transparent border-transparent"
                    : "bg-background/95 border-border/40"
            )}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
                <div className="flex items-center gap-2 z-50">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="p-2 md:hidden z-[1000] relative"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="flex flex-col justify-center items-center w-5 h-5 gap-1">
                            <motion.span
                                animate={
                                    isMobileMenuOpen
                                        ? { rotate: 45, y: 6 }
                                        : { rotate: 0, y: 0 }
                                }
                                className="w-5 h-0.5 bg-foreground block"
                            />
                            <motion.span
                                animate={
                                    isMobileMenuOpen
                                        ? { opacity: 0 }
                                        : { opacity: 1 }
                                }
                                className="w-5 h-0.5 bg-foreground block"
                            />
                            <motion.span
                                animate={
                                    isMobileMenuOpen
                                        ? { rotate: -45, y: -6 }
                                        : { rotate: 0, y: 0 }
                                }
                                className="w-5 h-0.5 bg-foreground block"
                            />
                        </div>
                    </button>
                    <Link
                        href="/"
                        className={cn(
                            "flex items-center space-x-2 cursor-hover",
                            isMobileMenuOpen ? "hidden" : "flex"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
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
                            {pathname === item.href && (
                                <motion.span
                                    layoutId="navbar-active"
                                    className="absolute inset-0 z-0 bg-secondary rounded-full"
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span className="relative z-10">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div
                    className={cn(
                        "flex items-center gap-4 z-50",
                        isMobileMenuOpen ? "hidden md:flex" : "flex"
                    )}
                >
                    <ThemeSwitcher />
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
                                className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md md:hidden"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <nav
                                    className="flex flex-col items-center gap-8 p-4"
                                    onClick={(e) => e.stopPropagation()}
                                >
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
        </motion.header>
    );
}
