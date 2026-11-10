"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CursorInner = dynamic(
  () => import("./custom-cursor-inner").then((mod) => mod.CursorInner),
  { ssr: false },
);

export const CustomCursor = () => {
  const [cursorState, setCursorState] = useState<{
    isVisible: boolean;
    initialPos: { x: number; y: number } | null;
  }>({
    isVisible: false,
    initialPos: null,
  });

  useEffect(() => {
    // Only show custom cursor on devices with fine pointer (mouse)
    const mediaQuery = window.matchMedia("(pointer: fine)");

    const handleFirstMove = (e: MouseEvent) => {
      if (mediaQuery.matches && !cursorState.initialPos) {
        setCursorState({
          isVisible: true,
          initialPos: { x: e.clientX, y: e.clientY },
        });
      }
    };

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (!e.matches) {
        setCursorState({ isVisible: false, initialPos: null });
      } else {
        window.addEventListener("mousemove", handleFirstMove, {
          once: true,
        });
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    if (!cursorState.initialPos && mediaQuery.matches) {
      window.addEventListener("mousemove", handleFirstMove, {
        once: true,
      });
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("mousemove", handleFirstMove);
    };
  }, [cursorState.initialPos]);

  if (!cursorState.isVisible || !cursorState.initialPos) return null;

  return (
    <CursorInner
      initialX={cursorState.initialPos.x}
      initialY={cursorState.initialPos.y}
    />
  );
};
