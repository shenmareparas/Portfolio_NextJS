"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import { m, AnimatePresence } from "framer-motion";

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const hasShown = sessionStorage.getItem("preloader_shown");
            if (hasShown) {
                setIsLoading(false);
            }
        }
        setMounted(true);
    }, []);

    const useIsomorphicLayoutEffect =
        typeof window !== "undefined" ? useLayoutEffect : useEffect;

    useIsomorphicLayoutEffect(() => {
        if (!mounted || !isLoading) return;

        const storageKey = "preloader_shown";

        const isPageReady = typeof document !== "undefined" ? document.readyState === "complete" : false;
        const progressRef = { current: 0 };
        // eslint-disable-next-line
        let trickleInterval: NodeJS.Timeout;

        // NProgress-style "Trickle" Logic
        const trickle = () => {
            const current = progressRef.current;
            if (current >= 100) {
                clearInterval(trickleInterval);
                return;
            }

            const random = Math.random();
            let amount: number;

            if (isPageReady) {
                // Fast mode: page already loaded
                if (current < 50) {
                    amount = 15 + random * 10;
                } else if (current < 80) {
                    amount = 10 + random * 5;
                } else {
                    amount = 5 + random * 3;
                }
            } else {
                // Normal trickle
                if (current < 20) {
                    amount = (random < 0.5 ? 3 : 5) + random * 5;
                } else if (current < 50) {
                    amount = random * 3;
                } else if (current < 80) {
                    amount = random * 2;
                } else if (current < 95) {
                    amount = random * 1;
                } else {
                    amount = random * 0.3;
                }
            }

            const next = Math.min(100, current + amount);
            progressRef.current = next;
            setProgress(next);

            if (next >= 100) {
                clearInterval(trickleInterval);
                sessionStorage.setItem(storageKey, "true");
                setTimeout(() => {
                    setIsLoading(false);
                }, 300);
            }
        };

        const intervalMs = isPageReady ? 50 : 200;
        trickleInterval = setInterval(trickle, intervalMs);

        return () => clearInterval(trickleInterval);
    }, [mounted]);

    if (!mounted) return null;

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <m.div
                    className="fixed top-0 left-0 right-0 z-[100] h-1"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    }}
                >
                    {/* Background track */}
                    <div className="h-full w-full bg-muted" />

                    {/* Progress bar */}
                    <m.div
                        className="absolute top-0 left-0 h-full w-full bg-primary origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: progress / 100 }}
                        transition={{
                            duration: 0.1,
                            ease: "easeOut",
                        }}
                    />
                </m.div>
            )}
        </AnimatePresence>
    );
}
