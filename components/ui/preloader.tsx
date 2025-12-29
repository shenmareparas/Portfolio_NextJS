"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoadingValue } from "@/components/providers/loading-provider";

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const loadingCount = useLoadingValue();

    const useIsomorphicLayoutEffect =
        typeof window !== "undefined" ? useLayoutEffect : useEffect;

    useIsomorphicLayoutEffect(() => {
        const hasShown = sessionStorage.getItem("preloader_shown");
        if (hasShown) {
            setIsLoading(false);
            return;
        }

        // Standard NProgress-style logic: start fast, slow down approaching 100%
        const interval = setInterval(() => {
            setProgress((prev) => {
                // If waiting for external assets and near completion, hold at 90%
                if (loadingCount > 0 && prev >= 90) {
                    return 90;
                }

                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsLoading(false);
                        sessionStorage.setItem("preloader_shown", "true");
                    }, 200);
                    return 100;
                }

                // Standard trickle logic: increment decreases as progress increases
                // This creates the classic "fast start, slow finish" effect
                let increment: number;
                if (prev < 20) {
                    increment = 10;
                } else if (prev < 50) {
                    increment = 4;
                } else if (prev < 80) {
                    increment = 2;
                } else if (prev < 90) {
                    increment = 0.5;
                } else {
                    increment = 0.1;
                }

                const maxNext = loadingCount > 0 ? 90 : 100;
                return Math.min(prev + increment, maxNext);
            });
        }, 100);

        return () => clearInterval(interval);
    }, [loadingCount]);

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
