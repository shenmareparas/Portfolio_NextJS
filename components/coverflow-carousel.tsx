"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CoverflowCarouselProps {
    images: string[];
    className?: string;
    autoScrollInterval?: number;
}

const MAX_VISIBILITY = 2;

const CarouselCard = React.memo(
    ({
        src,
        index,
        active,
        total,
        onClick,
        isDragging,
    }: {
        src: string;
        index: number;
        active: number;
        total: number;
        onClick: () => void;
        isDragging?: boolean;
    }) => {
        // Calculate circular distance
        let diff = index - active;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        const offset = -diff / 3; // Invert diff for offset to match original direction
        const absOffset = Math.abs(diff) / 3;
        const direction = Math.sign(-diff);
        const isActive = Math.abs(diff) < 0.5;

        if (Math.abs(diff) > MAX_VISIBILITY) return null;

        const style = {
            "--active": isActive ? 1 : 0,
            "--offset": offset,
            "--direction": direction,
            "--abs-offset": absOffset,
            transform: `
            rotateY(calc(var(--offset) * 50deg))
            scaleY(calc(1 + var(--abs-offset) * -0.4))
            translateZ(calc(var(--abs-offset) * -30rem))
            translateX(calc(var(--direction) * -5rem))
        `,
            filter: `blur(calc(var(--abs-offset) * 1rem))`,
            opacity: Math.abs(diff) >= MAX_VISIBILITY ? 0 : 1,
            zIndex: isActive ? 10 : 10 - Math.abs(diff),
        } as React.CSSProperties;

        return (
            <div
                className={cn(
                    "absolute w-[260px] md:w-[320px] aspect-[9/16] ease-out cursor-pointer touch-manipulation select-none will-change-[transform,opacity,filter] outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isDragging
                        ? "transition-none"
                        : "transition-all duration-500"
                )}
                style={style}
                onClick={onClick}
                role="button"
                tabIndex={isActive ? 0 : -1}
                aria-label={`View slide ${index + 1}`}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        onClick();
                    }
                }}
            >
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-900 border border-white/10 shadow-2xl">
                    <Image
                        src={src}
                        alt={`Slide ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 320px"
                        priority={isActive}
                        draggable={false}
                    />
                    <div
                        className="absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none"
                        style={{ opacity: isActive ? 0 : 0.4 }}
                    />
                </div>
            </div>
        );
    }
);

CarouselCard.displayName = "CarouselCard";

export function CoverflowCarousel({
    images,
    className,
    autoScrollInterval = 3000,
}: CoverflowCarouselProps) {
    const [active, setActive] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [dragOffset, setDragOffset] = useState(0); // In slide units

    const [interactionPause, setInteractionPause] = useState(false);
    const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const triggerInteractionPause = useCallback(() => {
        setInteractionPause(true);
        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
        }
        interactionTimeoutRef.current = setTimeout(() => {
            setInteractionPause(false);
        }, 3000);
    }, []);

    // Handle auto-scrolling
    useEffect(() => {
        if (isPaused || interactionPause) return;

        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % images.length);
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, [isPaused, interactionPause, images.length, autoScrollInterval]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                triggerInteractionPause();
                setActive((prev) => (prev - 1 + images.length) % images.length);
            } else if (e.key === "ArrowRight") {
                triggerInteractionPause();
                setActive((prev) => (prev + 1) % images.length);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [images.length, triggerInteractionPause]);

    const touchStart = useRef<number | null>(null);
    const touchEnd = useRef<number | null>(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    }, []);

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX;
    }, []);

    const onTouchEnd = useCallback(() => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            triggerInteractionPause();
            setActive((prev) => (prev + 1) % images.length);
        }
        if (isRightSwipe) {
            triggerInteractionPause();
            setActive((prev) => (prev - 1 + images.length) % images.length);
        }
    }, [images.length, triggerInteractionPause]);

    const lastWheelTime = useRef<number>(0);
    const mouseStart = useRef<number | null>(null);
    const mouseEnd = useRef<number | null>(null);
    const isDragging = useRef(false);
    const wasDragging = useRef(false);

    // Pill dragging refs
    const isPillDragging = useRef(false);
    const pillDragStart = useRef<number | null>(null);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        isDragging.current = true;
        mouseStart.current = e.clientX;
        mouseEnd.current = null;
        wasDragging.current = false;
    }, []);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging.current) return;
        mouseEnd.current = e.clientX;
        e.preventDefault();
    }, []);

    const onMouseUp = useCallback(() => {
        if (!isDragging.current) return;
        isDragging.current = false;

        if (mouseStart.current === null || mouseEnd.current === null) return;

        const distance = mouseStart.current - mouseEnd.current;

        if (Math.abs(distance) > minSwipeDistance) {
            wasDragging.current = true;
            if (distance > 0) {
                triggerInteractionPause();
                setActive((prev) => (prev + 1) % images.length);
            } else {
                triggerInteractionPause();
                setActive((prev) => (prev - 1 + images.length) % images.length);
            }
        }
    }, [images.length, triggerInteractionPause]);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();

                const now = Date.now();
                if (now - lastWheelTime.current < 500) return;

                if (Math.abs(e.deltaX) > 10) {
                    triggerInteractionPause();
                    if (e.deltaX > 0) {
                        setActive((prev) => (prev + 1) % images.length);
                    } else {
                        setActive(
                            (prev) => (prev - 1 + images.length) % images.length
                        );
                    }
                    lastWheelTime.current = now;
                }
            }
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => container.removeEventListener("wheel", handleWheel);
    }, [images.length, triggerInteractionPause]);

    // Pill drag logic
    const handlePillDrag = useCallback(
        (currentX: number) => {
            if (pillDragStart.current === null) return;
            const distance = currentX - pillDragStart.current;

            // Sensitivity: 100px drag = 1 slide change
            let offset = distance / 100;

            // Clamp offset to prevent looping
            // We want active + offset to be between [0, images.length - 1]
            const minOffset = -active;
            const maxOffset = images.length - 1 - active;

            offset = Math.max(minOffset, Math.min(maxOffset, offset));

            setDragOffset(offset);
        },
        [setDragOffset, active, images.length]
    );

    useEffect(() => {
        const handleWindowMouseMove = (e: MouseEvent) => {
            if (isPillDragging.current) {
                handlePillDrag(e.clientX);
            }
        };
        const handleWindowMouseUp = () => {
            if (isPillDragging.current) {
                isPillDragging.current = false;

                // Snap to nearest slide
                const newActive = active + dragOffset;

                // Normalize newActive
                // We want to round to the nearest integer
                const snapped = Math.round(newActive);

                // No wrapping needed since we clamped the offset
                setActive(snapped);
                setDragOffset(0);
                pillDragStart.current = null;
                triggerInteractionPause();
            }
        };

        window.addEventListener("mousemove", handleWindowMouseMove);
        window.addEventListener("mouseup", handleWindowMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleWindowMouseMove);
            window.removeEventListener("mouseup", handleWindowMouseUp);
        };
    }, [
        handlePillDrag,
        active,
        dragOffset,
        images.length,
        triggerInteractionPause,
    ]);

    const onPillMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault(); // Prevent text selection
            isPillDragging.current = true;
            pillDragStart.current = e.clientX;
            setDragOffset(0);
        },
        [setDragOffset]
    );

    const onPillTouchStart = useCallback(
        (e: React.TouchEvent) => {
            e.stopPropagation();
            pillDragStart.current = e.touches[0].clientX;
            setDragOffset(0);
        },
        [setDragOffset]
    );

    const onPillTouchMove = useCallback(
        (e: React.TouchEvent) => {
            e.stopPropagation();
            handlePillDrag(e.touches[0].clientX);
        },
        [handlePillDrag]
    );

    const onPillTouchEnd = useCallback(() => {
        if (isPillDragging.current) {
            isPillDragging.current = false;

            const newActive = active + dragOffset;
            const snapped = Math.round(newActive);

            setActive(snapped);
            setDragOffset(0);
            pillDragStart.current = null;
            triggerInteractionPause();
        }
    }, [active, dragOffset, triggerInteractionPause]);

    const handleCardClick = useCallback(
        (index: number) => {
            if (wasDragging.current || isPillDragging.current) return;
            triggerInteractionPause();

            if (index === active) return;

            // Calculate circular distance
            let diff = index - active;
            if (diff > images.length / 2) diff -= images.length;
            if (diff < -images.length / 2) diff += images.length;

            if (diff > 0) {
                setActive((prev) => (prev + 1) % images.length);
            } else {
                setActive((prev) => (prev - 1 + images.length) % images.length);
            }
        },
        [triggerInteractionPause, active, images.length]
    );

    // Calculate effective active state for rendering
    // We round the value so that the carousel snaps to integer positions
    // instead of interpolating smoothly. This creates a "snap" effect
    // where the cards animate to the next position only when the threshold is crossed.
    const effectiveActive = Math.round(active + dragOffset);

    // Calculate normalized active index for dots
    // This ensures the "pill" snaps to the correct dot even when wrapping around
    const normalizedActive =
        ((effectiveActive % images.length) + images.length) % images.length;

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full max-w-6xl mx-auto py-12", className)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
                setIsPaused(false);
                if (isDragging.current) onMouseUp();
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="relative w-full h-[600px] flex items-center justify-center [perspective:500px] [transform-style:preserve-3d] overflow-hidden">
                {/* Left Navigation */}
                <button
                    type="button"
                    className="absolute left-4 z-50 p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all hover:scale-110 outline-none touch-manipulation select-none opacity-100 visible"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        triggerInteractionPause();
                        setActive(
                            (prev) => (prev - 1 + images.length) % images.length
                        );
                    }}
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>

                {/* Cards */}
                {images.map((src, i) => (
                    <CarouselCard
                        key={i}
                        src={src}
                        index={i}
                        active={effectiveActive}
                        total={images.length}
                        onClick={() => handleCardClick(i)}
                        // We want transitions enabled so they animate to the new snapped position
                        isDragging={false}
                    />
                ))}

                {/* Right Navigation */}
                <button
                    type="button"
                    className="absolute right-4 z-50 p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all hover:scale-110 outline-none touch-manipulation select-none opacity-100 visible"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        triggerInteractionPause();
                        setActive((prev) => (prev + 1) % images.length);
                    }}
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-8">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            triggerInteractionPause();
                            setActive(idx);
                        }}
                        className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            idx === normalizedActive
                                ? "bg-primary w-8 cursor-grab active:cursor-grabbing"
                                : "bg-primary/20 w-2 hover:bg-primary/40"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                        onMouseDown={
                            idx === active ? onPillMouseDown : undefined
                        }
                        onTouchStart={
                            idx === active ? onPillTouchStart : undefined
                        }
                        onTouchMove={
                            idx === active ? onPillTouchMove : undefined
                        }
                        onTouchEnd={idx === active ? onPillTouchEnd : undefined}
                    />
                ))}
            </div>
        </div>
    );
}
