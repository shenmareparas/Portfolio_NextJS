"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";

let globalIsKeyboardNav = false;
let lastGlobalScreenX = -1;
let lastGlobalScreenY = -1;

if (typeof window !== "undefined") {
  window.addEventListener(
    "keydown",
    (e) => {
      if (
        e.key === "Tab" ||
        e.key.startsWith("Arrow") ||
        e.key === "Enter" ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
      ) {
        globalIsKeyboardNav = true;
      }
    },
    { capture: true },
  );

  window.addEventListener("mousemove", (e) => {
    // Only genuine physical displacement (>3px screen coords) deactivates keyboard mode
    if (
      lastGlobalScreenX !== -1 &&
      (Math.abs(e.screenX - lastGlobalScreenX) > 3 ||
        Math.abs(e.screenY - lastGlobalScreenY) > 3)
    ) {
      globalIsKeyboardNav = false;
    }
    lastGlobalScreenX = e.screenX;
    lastGlobalScreenY = e.screenY;
  });
}

export function setGlobalKeyboardNav(value: boolean) {
  globalIsKeyboardNav = value;
}

export function getGlobalKeyboardNav() {
  return globalIsKeyboardNav;
}

const subscribeHover = (callback: () => void) => {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};

const getHoverSnapshot = () => window.matchMedia("(pointer: fine)").matches;
const getServerSnapshot = () => false;

export function useCardGridNav() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isKeyboardNav, setIsKeyboardNav] = useState(() => globalIsKeyboardNav);
  const lastMousePosRef = useRef({ x: -1, y: -1 });

  const hasHover = useSyncExternalStore(
    subscribeHover,
    getHoverSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Tab" ||
        e.key.startsWith("Arrow") ||
        e.key === "Enter" ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
      ) {
        globalIsKeyboardNav = true;
        setIsKeyboardNav(true);
        setHoveredIndex(null);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Check physical screen coordinates threshold (>3px) to prevent synthetic scroll events
      if (
        lastMousePosRef.current.x !== -1 &&
        (Math.abs(lastMousePosRef.current.x - e.screenX) > 3 ||
          Math.abs(lastMousePosRef.current.y - e.screenY) > 3)
      ) {
        globalIsKeyboardNav = false;
        setIsKeyboardNav(false);

        // Transition from keyboard focus to mouse hover: clear focusedIndex
        setFocusedIndex(null);
      }
      lastMousePosRef.current = { x: e.screenX, y: e.screenY };
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleHover = useCallback(
    (index: number) => {
      if (hasHover && !isKeyboardNav && !globalIsKeyboardNav) {
        setHoveredIndex(index);
      }
    },
    [hasHover, isKeyboardNav],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
    setHoveredIndex(null);
  }, []);

  const handleBlur = useCallback((index: number) => {
    setFocusedIndex((prev) => (prev === index ? null : prev));
  }, []);

  const activeIndex =
    focusedIndex !== null
      ? focusedIndex
      : isKeyboardNav || globalIsKeyboardNav
        ? null
        : hoveredIndex;

  return {
    hasHover,
    activeIndex,
    focusedIndex,
    hoveredIndex,
    isKeyboardNav: isKeyboardNav || globalIsKeyboardNav,
    handleHover,
    handleMouseLeave,
    handleFocus,
    handleBlur,
  };
}
