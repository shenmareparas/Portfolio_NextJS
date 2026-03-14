"use client";

import { useEffect, useState, useReducer } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";

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

        const handleMediaChange = (e: MediaQueryListEvent) => {
            if (!e.matches) {
                setCursorState({ isVisible: false, initialPos: null });
            } else {
                window.addEventListener("mousemove", handleFirstMove, {
                    once: true,
                });
            }
        };

        const handleFirstMove = (e: MouseEvent) => {
            if (mediaQuery.matches && !cursorState.initialPos) {
                setCursorState({
                    isVisible: true,
                    initialPos: { x: e.clientX, y: e.clientY },
                });
            }
        };

        mediaQuery.addEventListener("change", handleMediaChange);
        if (!cursorState.initialPos) {
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

const CursorInner = ({
    initialX,
    initialY,
}: {
    initialX: number;
    initialY: number;
}) => {
    const mouseX = useMotionValue(initialX);
    const mouseY = useMotionValue(initialY);

    const springConfig = { damping: 35, stiffness: 400, mass: 0.1 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const cursorX = useTransform(springX, (x) => x - 40);
    const cursorY = useTransform(springY, (y) => y - 40);

    const [interactState, dispatchInteract] = useReducer(
        (state: any, action: any) => ({ ...state, ...action }),
        { isHovering: false, isDragging: false }
    );

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive =
                target.closest("a") ||
                target.closest("button") ||
                target.closest(".cursor-hover");

            dispatchInteract({ isHovering: !!interactive });
        };

        const handleMouseDown = (e: MouseEvent) => {
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

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", handleMouseOver);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [mouseX, mouseY]);

    return (
        <m.div
            className="fixed top-0 left-0 w-20 h-20 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
            style={{
                x: cursorX,
                y: cursorY,
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
                opacity: interactState.isDragging ? 0 : 1,
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
