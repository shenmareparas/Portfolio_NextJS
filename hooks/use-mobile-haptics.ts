"use client";

import { useWebHaptics } from "web-haptics/react";
import { useCallback, useSyncExternalStore } from "react";
import type {
  HapticInput,
  TriggerOptions,
  WebHapticsOptions,
} from "web-haptics";

const subscribeMobile = (callback: () => void) => {
  const mq = window.matchMedia("(max-width: 768px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};

const getMobileSnapshot = () => window.matchMedia("(max-width: 768px)").matches;
const getServerSnapshot = () => false;

/**
 * Wraps `useWebHaptics` with an SSR-safe `(max-width: 768px)` viewport guard
 * so haptic feedback triggers only on mobile viewports.
 */
export function useMobileHaptics(webHapticsOptions?: WebHapticsOptions) {
  const {
    trigger: triggerWebHaptic,
    cancel,
    isSupported,
  } = useWebHaptics(webHapticsOptions);
  const isMobile = useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    getServerSnapshot,
  );

  const trigger = useCallback(
    (input?: HapticInput, options?: TriggerOptions) => {
      if (isMobile) {
        return triggerWebHaptic(input, options);
      }
      return undefined;
    },
    [isMobile, triggerWebHaptic],
  );

  return { trigger, cancel, isSupported };
}
