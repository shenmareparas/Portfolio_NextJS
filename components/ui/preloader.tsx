"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [shouldAnimate, setShouldAnimate] = useState(true);
    const [counter, setCounter] = useState(0);

    const useIsomorphicLayoutEffect =
        typeof window !== "undefined" ? useLayoutEffect : useEffect;

    useIsomorphicLayoutEffect(() => {
        const hasShown = sessionStorage.getItem("preloader_shown");
        if (hasShown) {
            setShouldAnimate(false);
            setIsLoading(false);
            return;
        }

        const interval = setInterval(() => {
            setCounter((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsLoading(false);
                        sessionStorage.setItem("preloader_shown", "true");
                    }, 500); // Small delay after reaching 100%
                    return 100;
                }
                // Random increment for more realistic feel
                const increment = Math.floor(Math.random() * 15) + 5; // Faster increment
                return Math.min(prev + increment, 100);
            });
        }, 50); // Faster interval

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-background"
                    initial={{ y: 0 }}
                    exit={
                        shouldAnimate
                            ? {
                                  y: "-100%",
                                  transition: {
                                      duration: 0.8,
                                      ease: [0.76, 0, 0.24, 1],
                                  },
                              }
                            : { opacity: 0, transition: { duration: 0 } }
                    }
                >
                    <div className="flex items-end overflow-hidden">
                        <motion.span
                            className="text-[15vw] font-bold leading-none text-foreground"
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {counter}
                        </motion.span>
                        <span className="mb-4 text-4xl font-bold text-foreground">
                            %
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
