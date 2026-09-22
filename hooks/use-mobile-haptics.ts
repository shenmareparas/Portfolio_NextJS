"use client";

import { useWebHaptics } from "web-haptics/react";
import { useCallback, useSyncExternalStore } from "react";

const subscribeMobile = (callback: () => void) => {
    const mq = window.matchMedia("(max-width: 768px)");
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
};

const getMobileSnapshot = () => window.matchMedia("(max-width: 768px)").matches;
const getServerSnapshot = () => false;

export function useMobileHaptics() {
    const defaultHaptics = useWebHaptics();
    const isMobile = useSyncExternalStore(
        subscribeMobile,
        getMobileSnapshot,
        getServerSnapshot,
    );

    const trigger = useCallback(
        (type?: string) => {
            if (isMobile) {
                defaultHaptics.trigger(type);
            }
        },
        [isMobile, defaultHaptics],
    );

    return { ...defaultHaptics, trigger };
}

