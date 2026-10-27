"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

let cachedIsMac: boolean | null = null;
let cachedIsMobile: boolean | null = null;

function checkIsMac(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  if (cachedIsMac === null) {
    const nav = navigator as { userAgentData?: { platform?: string } };
    if (nav.userAgentData?.platform) {
      cachedIsMac = /^mac/i.test(nav.userAgentData.platform);
    } else {
      const userAgent = navigator.userAgent || "";
      const platform = navigator.platform || "";
      const isAppleMobile =
        /iPhone|iPad|iPod/i.test(platform) ||
        /iPhone|iPad|iPod/i.test(userAgent);
      const isMacIntel =
        /Mac/i.test(platform) || /Macintosh|Mac OS X/i.test(userAgent);
      const isIPadOS = platform === "MacIntel" && navigator.maxTouchPoints > 1;

      cachedIsMac = isMacIntel && !isAppleMobile && !isIPadOS;
    }
  }
  return cachedIsMac;
}

function checkIsMobileDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  if (cachedIsMobile === null) {
    const nav = navigator as {
      userAgentData?: { mobile?: boolean; platform?: string };
    };
    if (typeof nav.userAgentData?.mobile === "boolean") {
      cachedIsMobile = nav.userAgentData.mobile;
    } else {
      const userAgent = navigator.userAgent || "";
      const platform = navigator.platform || "";
      const isMobileUA =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent,
        );
      const isMobilePlatform = /Android|iPhone|iPad|iPod/i.test(platform);
      const isIPadOS = platform === "MacIntel" && navigator.maxTouchPoints > 1;

      cachedIsMobile = isMobileUA || isMobilePlatform || isIPadOS;
    }
  }
  return cachedIsMobile;
}

const getMacSnapshot = () => checkIsMac();
const getMobileSnapshot = () => checkIsMobileDevice();
const getServerSnapshot = () => false;

/**
 * Returns true if the client environment is macOS desktop.
 * Defaults to false on SSR so the site serves Windows / PC (Ctrl+K) by default.
 */
export function useIsMac(): boolean {
  return useSyncExternalStore(subscribe, getMacSnapshot, getServerSnapshot);
}

/**
 * Returns true if the client environment is a mobile device (Android, iOS / iPadOS).
 * Defaults to false on SSR.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getMobileSnapshot, getServerSnapshot);
}

/**
 * Returns true if the environment is Windows / PC desktop (default for the mass audience).
 * Defaults to true on SSR so that Ctrl+K is rendered immediately in the server HTML.
 */
export function useIsWindows(): boolean {
  const isMac = useIsMac();
  const isMobile = useIsMobile();
  return !isMac && !isMobile;
}
