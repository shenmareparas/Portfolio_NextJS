"use client";

import { useEffect, useReducer } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";

const springConfig = { damping: 35, stiffness: 400, mass: 0.1 };

export const CursorInner = ({
  initialX,
  initialY,
}: {
  initialX: number;
  initialY: number;
}) => {
  const mouseX = useMotionValue(initialX);
  const mouseY = useMotionValue(initialY);

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const cursorX = useTransform(springX, (x) => x - 40);
  const cursorY = useTransform(springY, (y) => y - 40);

  const [interactState, dispatchInteract] = useReducer(
    (
      state: { isHovering: boolean; isDragging: boolean; isHidden: boolean },
      action: Partial<{
        isHovering: boolean;
        isDragging: boolean;
        isHidden: boolean;
      }>,
    ) => ({ ...state, ...action }),
    { isHovering: false, isDragging: false, isHidden: false },
  );

  useEffect(() => {
    let lastScreenX = -1;
    let lastScreenY = -1;
    let isKeyboardActive = false;

    const updateMousePosition = (e: MouseEvent) => {
      const isPhysicalMovement =
        lastScreenX !== -1 &&
        (Math.abs(e.screenX - lastScreenX) > 3 ||
          Math.abs(e.screenY - lastScreenY) > 3);

      lastScreenX = e.screenX;
      lastScreenY = e.screenY;

      if (isPhysicalMovement && isKeyboardActive) {
        isKeyboardActive = false;
        dispatchInteract({ isHidden: false });
      }
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (isKeyboardActive) return;

      const target = e.target as HTMLElement;
      const interactive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".cursor-hover");

      dispatchInteract({ isHovering: !!interactive });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key !== "Shift" &&
        e.key !== "Alt" &&
        e.key !== "Control" &&
        e.key !== "Meta"
      ) {
        isKeyboardActive = true;
        dispatchInteract({ isHidden: true, isHovering: false });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (isKeyboardActive) {
        isKeyboardActive = false;
        dispatchInteract({ isHidden: false });
      }
      const scrollbarThreshold = 20;
      const isNearRightEdge =
        e.clientX >= window.innerWidth - scrollbarThreshold;
      const isNearBottomEdge =
        e.clientY >= window.innerHeight - scrollbarThreshold;

      if (isNearRightEdge || isNearBottomEdge) {
        dispatchInteract({ isDragging: true });
      }
    };

    const handleMouseUp = () => {
      dispatchInteract({ isDragging: false });
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [initialX, initialY, mouseX, mouseY]);

  return (
    <m.div
      aria-hidden="true"
      className="fixed top-0 left-0 w-20 h-20 bg-white rounded-full pointer-events-none z-[99999] mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
      }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{
        opacity: interactState.isDragging || interactState.isHidden ? 0 : 1,
        scale: interactState.isHovering ? 1 : 0.4,
      }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{
        opacity: { duration: 0.2 },
        scale: {
          type: "spring",
          stiffness: 300,
          damping: 25,
        },
      }}
    />
  );
};
