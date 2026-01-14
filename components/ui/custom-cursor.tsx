"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const CustomCursor = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [initialPos, setInitialPos] = useState<{
        x: number;
        y: number;
    } | null>(null);

    useEffect(() => {
        // Only show custom cursor on devices with fine pointer (mouse)
        const mediaQuery = window.matchMedia("(pointer: fine)");

        const handleMediaChange = (e: MediaQueryListEvent) => {
            if (!e.matches) {
                setIsVisible(false);
                setInitialPos(null);
            } else {
                window.addEventListener("mousemove", handleFirstMove, {
                    once: true,
                });
            }
        };

        const handleFirstMove = (e: MouseEvent) => {
            if (mediaQuery.matches && !initialPos) {
                setInitialPos({ x: e.clientX, y: e.clientY });
                setIsVisible(true);
            }
        };

        mediaQuery.addEventListener("change", handleMediaChange);
        if (!initialPos) {
            window.addEventListener("mousemove", handleFirstMove, {
                once: true,
            });
        }

        return () => {
            mediaQuery.removeEventListener("change", handleMediaChange);
            window.removeEventListener("mousemove", handleFirstMove);
        };
    }, [initialPos]);

    if (!isVisible || !initialPos) return null;

    return <CursorInner initialX={initialPos.x} initialY={initialPos.y} />;
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

    const [isHovering, setIsHovering] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

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

            if (interactive) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            // Only hide cursor when clicking near the scrollbar area
            const scrollbarThreshold = 20;
            const isNearRightEdge =
                e.clientX >= window.innerWidth - scrollbarThreshold;
            const isNearBottomEdge =
                e.clientY >= window.innerHeight - scrollbarThreshold;

            if (isNearRightEdge || isNearBottomEdge) {
                setIsDragging(true);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
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
        <motion.div
            className="fixed top-0 left-0 w-20 h-20 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
            style={{
                x: cursorX,
                y: cursorY,
            }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{
                opacity: isDragging ? 0 : 1,
                scale: isHovering ? 1 : 0.4,
            }}
            exit={{ opacity: 0, scale: 0 }}
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
