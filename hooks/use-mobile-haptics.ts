"use client";

import { useWebHaptics } from "web-haptics/react";
import { useCallback, useEffect, useState } from "react";

export function useMobileHaptics() {
    const defaultHaptics = useWebHaptics();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(max-width: 768px)").matches);
        };

        // Check initially
        checkMobile();

        // Add event listener for screen size changes
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        mediaQuery.addEventListener("change", checkMobile);

        return () => mediaQuery.removeEventListener("change", checkMobile);
    }, []);

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
