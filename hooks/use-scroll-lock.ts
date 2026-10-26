"use client";

import { useEffect } from "react";

let activeLockCount = 0;
let prevHtmlOverflow = "";
let prevBodyOverflow = "";

function lockScroll() {
  if (typeof document === "undefined") return;
  if (activeLockCount === 0) {
    prevHtmlOverflow = document.documentElement.style.overflow;
    prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
  activeLockCount++;
}

function unlockScroll() {
  if (typeof document === "undefined") return;
  activeLockCount = Math.max(0, activeLockCount - 1);
  if (activeLockCount === 0) {
    document.documentElement.style.overflow = prevHtmlOverflow;
    document.body.style.overflow = prevBodyOverflow;
  }
}

export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [isLocked]);
}
