"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const useIsomorphicLayoutEffect =
        typeof window !== "undefined" ? useLayoutEffect : useEffect;

    useIsomorphicLayoutEffect(() => {
        const storageKey = "preloader_shown";
        const hasShown = sessionStorage.getItem(storageKey);
        if (hasShown) {
            setIsLoading(false);
            return;
        }

        // Check if page is already loaded (cached/fast navigation)
        const isPageReady = document.readyState === "complete";

        // NProgress-style "Trickle" Logic
        const trickle = () => {
            setProgress((prev) => {
                if (prev >= 100) {
                    return 100;
                }

                const random = Math.random();
                let amount: number;

                if (isPageReady) {
                    // Fast mode: page already loaded
                    if (prev < 50) {
                        amount = 15 + random * 10;
                    } else if (prev < 80) {
                        amount = 10 + random * 5;
                    } else {
                        amount = 5 + random * 3;
                    }
                } else {
                    // Normal trickle
                    if (prev < 20) {
                        amount = (random < 0.5 ? 3 : 5) + random * 5;
                    } else if (prev < 50) {
                        amount = random * 3;
                    } else if (prev < 80) {
                        amount = random * 2;
                    } else if (prev < 95) {
                        amount = random * 1;
                    } else {
                        amount = random * 0.3;
                    }
                }

                const next = prev + amount;

                if (next >= 100) {
                    setTimeout(() => {
                        setIsLoading(false);
                        sessionStorage.setItem(storageKey, "true");
                    }, 300);
                    return 100;
                }

                return next;
            });
        };

        const intervalMs = isPageReady ? 50 : 200;
        const trickleInterval = setInterval(trickle, intervalMs);

        return () => clearInterval(trickleInterval);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
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
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{
                            duration: 0.1,
                            ease: "easeOut",
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
