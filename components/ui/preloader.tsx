"use client";

import { useEffect, useState, useSyncExternalStore, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";

const subscribe = () => () => {};
const getClientMounted = () => true;
const getServerMounted = () => false;

const getPreloaderShownSnapshot = () => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("preloader_shown") === "true";
};
const getServerPreloaderShownSnapshot = () => false;

export function Preloader() {
    const isMounted = useSyncExternalStore(
        subscribe,
        getClientMounted,
        getServerMounted
    );

    const hasShown = useSyncExternalStore(
        subscribe,
        getPreloaderShownSnapshot,
        getServerPreloaderShownSnapshot
    );

    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(0);

    useEffect(() => {
        if (hasShown) {
            return;
        }

        const isPageReady = document.readyState === "complete";
        let timeoutId: NodeJS.Timeout;

        const trickle = () => {
            const current = progressRef.current;
            if (current >= 100) {
                return;
            }

            const random = Math.random();
            let amount: number;

            if (isPageReady) {
                if (current < 50) {
                    amount = 15 + random * 10;
                } else if (current < 80) {
                    amount = 10 + random * 5;
                } else {
                    amount = 5 + random * 3;
                }
            } else {
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
                sessionStorage.setItem("preloader_shown", "true");
                timeoutId = setTimeout(() => {
                    setIsLoading(false);
                }, 300);
            }
        };

        const intervalMs = isPageReady ? 50 : 200;
        const trickleInterval = setInterval(trickle, intervalMs);

        return () => {
            clearInterval(trickleInterval);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [hasShown]);

    if (!isMounted || hasShown) return null;

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
