"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";

let globalIsKeyboardNav = false;

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
    if (e.movementX !== 0 || e.movementY !== 0) {
      globalIsKeyboardNav = false;
    }
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
      if (e.key === "Tab" || e.key.startsWith("Arrow")) {
        globalIsKeyboardNav = true;
        setIsKeyboardNav(true);
        setHoveredIndex(null);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Check if coordinates actually changed with threshold > 2px to prevent scrolling from firing synthetic mousemove
      if (
        lastMousePosRef.current.x !== -1 &&
        (Math.abs(lastMousePosRef.current.x - e.clientX) > 2 ||
          Math.abs(lastMousePosRef.current.y - e.clientY) > 2)
      ) {
        globalIsKeyboardNav = false;
        setIsKeyboardNav(false);

        // Clear any focused card state when physically moving mouse
        setFocusedIndex((prev) => {
          if (prev !== null) {
            if (
              typeof document !== "undefined" &&
              document.activeElement instanceof HTMLElement &&
              document.activeElement.closest(".group")
            ) {
              document.activeElement.blur();
            }
            return null;
          }
          return prev;
        });
      }
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
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
        setFocusedIndex(null);
      }
    },
    [hasHover, isKeyboardNav],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  const handleFocus = useCallback(
    (index: number) => {
      if (isKeyboardNav || globalIsKeyboardNav) {
        setFocusedIndex(index);
        setHoveredIndex(null);
      }
    },
    [isKeyboardNav],
  );

  const handleBlur = useCallback((index: number) => {
    setFocusedIndex((prev) => (prev === index ? null : prev));
  }, []);

  const activeKeyboard = isKeyboardNav || globalIsKeyboardNav;
  const activeIndex = activeKeyboard ? focusedIndex : hoveredIndex;

  return {
    hasHover,
    activeIndex,
    focusedIndex: activeKeyboard ? focusedIndex : null,
    hoveredIndex,
    isKeyboardNav: activeKeyboard,
    handleHover,
    handleMouseLeave,
    handleFocus,
    handleBlur,
  };
}
