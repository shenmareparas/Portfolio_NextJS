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
    }: {
        src: string;
        index: number;
        active: number;
        total: number;
        onClick: () => void;
    }) => {
        // Calculate circular distance
        let diff = index - active;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        const offset = -diff / 3; // Invert diff for offset to match original direction
        const absOffset = Math.abs(diff) / 3;
        const direction = Math.sign(-diff);
        const isActive = index === active;

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
                className="absolute w-[260px] md:w-[320px] aspect-[9/16] transition-all duration-500 ease-out cursor-pointer touch-manipulation select-none will-change-[transform,opacity,filter]"
                style={style}
                onClick={onClick}
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

    const handleCardClick = useCallback(
        (index: number) => {
            if (wasDragging.current) return;
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
                        active={active}
                        total={images.length}
                        onClick={() => handleCardClick(i)}
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
                            idx === active
                                ? "bg-primary w-8"
                                : "bg-primary/20 w-2 hover:bg-primary/40"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
