"use client";

import { useState, useSyncExternalStore } from "react";

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
    getServerMounted,
  );

  const hasShown = useSyncExternalStore(
    subscribe,
    getPreloaderShownSnapshot,
    getServerPreloaderShownSnapshot,
  );

  const [isDismissed, setIsDismissed] = useState(false);

  if (!isMounted || hasShown || isDismissed) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-1 pointer-events-none"
    >
      <div className="h-full w-full bg-muted" />
      <div
        onAnimationEnd={() => {
          sessionStorage.setItem("preloader_shown", "true");
          setIsDismissed(true);
        }}
        className="animate-preloader-bar absolute top-0 left-0 h-full w-full bg-primary"
      />
    </div>
  );
}
