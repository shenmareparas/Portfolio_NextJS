"use client";

import { useEffect, useState, useRef } from "react";
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

    // Toggle cursor class based on visibility
    useEffect(() => {
        if (isVisible) {
            document.documentElement.classList.add("hide-default-cursor");
        } else {
            document.documentElement.classList.remove("hide-default-cursor");
        }

        return () => {
            document.documentElement.classList.remove("hide-default-cursor");
        };
    }, [isVisible]);

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

    // Smoother spring config: reduced mass for responsiveness, adjusted damping/stiffness
    const springConfig = { damping: 20, stiffness: 300, mass: 0.2 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const cursorX = useTransform(springX, (x) => x - 16);
    const cursorY = useTransform(springY, (y) => y - 16);

    const [isHovering, setIsHovering] = useState(false);
    const hoveredEl = useRef<HTMLElement | null>(null);
    const hoveredRect = useRef<DOMRect | null>(null);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            if (hoveredEl.current && hoveredRect.current) {
                const rect = hoveredRect.current;
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const distanceX = e.clientX - centerX;
                const distanceY = e.clientY - centerY;

                // Magnetic pull factor (0.5 means cursor moves half the distance of mouse)
                mouseX.set(centerX + distanceX * 0.5);
                mouseY.set(centerY + distanceY * 0.5);
            } else {
                mouseX.set(e.clientX);
                mouseY.set(e.clientY);
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive =
                target.closest("a") ||
                target.closest("button") ||
                target.closest(".cursor-hover");

            if (interactive) {
                setIsHovering(true);
                hoveredEl.current = interactive as HTMLElement;
                hoveredRect.current = interactive.getBoundingClientRect();
            } else {
                setIsHovering(false);
                hoveredEl.current = null;
                hoveredRect.current = null;
            }
        };

        // Update rect on scroll to keep magnetic effect accurate
        const handleScroll = () => {
            if (hoveredEl.current) {
                hoveredRect.current = hoveredEl.current.getBoundingClientRect();
            }
        };

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", handleMouseOver);
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", handleMouseOver);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
            style={{
                x: cursorX,
                y: cursorY,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: 1,
                scale: isHovering ? 2.5 : 1,
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
