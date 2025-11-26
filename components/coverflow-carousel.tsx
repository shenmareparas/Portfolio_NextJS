"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CoverflowCarouselProps {
    images: string[];
    className?: string;
}

export function CoverflowCarousel({
    images,
    className,
    autoScrollInterval = 3000,
}: CoverflowCarouselProps & { autoScrollInterval?: number }) {
    const [active, setActive] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Handle auto-scrolling
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % images.length);
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, [isPaused, images.length, autoScrollInterval]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                setActive((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "ArrowRight") {
                setActive((prev) => Math.min(prev + 1, images.length - 1));
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [images.length]);

    return (
        <div
            className={cn("relative w-full max-w-6xl mx-auto py-12", className)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative w-full h-[600px] flex items-center justify-center [perspective:500px] [transform-style:preserve-3d] overflow-hidden">
                {/* Left Navigation */}
                <button
                    type="button"
                    className={cn(
                        "absolute left-4 z-50 p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all hover:scale-110 outline-none touch-manipulation select-none",
                        active === 0
                            ? "opacity-0 invisible pointer-events-none"
                            : "opacity-100 visible"
                    )}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (active > 0) {
                            setActive((prev) => prev - 1);
                        }
                    }}
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>

                {/* Cards */}
                {images.map((src, i) => {
                    const offset = (active - i) / 3;
                    const absOffset = Math.abs(active - i) / 3;
                    const direction = Math.sign(active - i);
                    const isActive = i === active;

                    // Visibility check
                    const MAX_VISIBILITY = 3;
                    if (Math.abs(active - i) > MAX_VISIBILITY) return null;

                    // CSS Variables style object
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
                        opacity: Math.abs(active - i) >= MAX_VISIBILITY ? 0 : 1,
                        zIndex: isActive ? 10 : 10 - Math.abs(active - i),
                    } as React.CSSProperties;

                    return (
                        <div
                            key={i}
                            className="absolute w-[260px] md:w-[320px] aspect-[9/16] transition-all duration-500 ease-out cursor-pointer touch-manipulation"
                            style={style}
                            onClick={() => setActive(i)}
                        >
                            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-900 border border-white/10 shadow-2xl">
                                <Image
                                    src={src}
                                    alt={`Slide ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 320px"
                                    priority={isActive}
                                />
                                {/* Overlay for inactive cards */}
                                <div
                                    className="absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none"
                                    style={{ opacity: isActive ? 0 : 0.4 }}
                                />
                            </div>
                        </div>
                    );
                })}

                {/* Right Navigation */}
                <button
                    type="button"
                    className={cn(
                        "absolute right-4 z-50 p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all hover:scale-110 outline-none touch-manipulation select-none",
                        active === images.length - 1
                            ? "opacity-0 invisible pointer-events-none"
                            : "opacity-100 visible"
                    )}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (active < images.length - 1) {
                            setActive((prev) => prev + 1);
                        }
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
