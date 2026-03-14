"use client";

import React, { useState, useEffect, useRef, useCallback, useReducer, useMemo, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import { GalleryItem } from "@/types/project";
import { useLoadingActions } from "@/components/providers/loading-provider";
import { Badge } from "@/components/ui/badge";
import { useMobileHaptics } from "@/hooks/use-mobile-haptics";

interface CoverflowCarouselProps {
    images: GalleryItem[];
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
        className,
    }: {
        src: string;
        index: number;
        active: number;
        total: number;
        onClick: (index: number) => void;
        isDragging?: boolean;
        className?: string;
    }) => {
        let diff = index - active;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        const offset = -diff / 3;
        const absOffset = Math.abs(diff) / 3;
        const direction = Math.sign(-diff);
        const isActive = Math.abs(diff) < 0.5;

        const { incrementLoading, decrementLoading } = useLoadingActions();
        const loadedRef = useRef(false);

        useEffect(() => {
            incrementLoading();
            return () => {
                if (!loadedRef.current) decrementLoading();
            };
        }, [incrementLoading, decrementLoading]);

        const handleImageLoad = () => {
            if (!loadedRef.current) {
                loadedRef.current = true;
                decrementLoading();
            }
        };

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
                    "absolute w-[260px] xl:w-[320px] aspect-[9/16] ease-out cursor-pointer touch-manipulation select-none will-change-[transform,opacity,filter] outline-none focus-visible:ring-2 focus-visible:ring-primary [container-type:inline-size]",
                    className,
                    isDragging ? "transition-none" : "transition-all duration-700",
                )}
                style={style}
                onClick={() => onClick(index)}
                role="button"
                tabIndex={isActive ? 0 : -1}
                aria-label={`View slide ${index + 1}`}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onClick(index);
                }}
            >
                <div className="relative w-full h-full rounded-[14cqw] bg-[#1c1c1e] p-[1.2cqw] shadow-2xl ring-1 ring-white/10">
                    <div className="absolute inset-0 rounded-[14cqw] border-[0.5cqw] border-[#ffffff10] pointer-events-none z-10" />
                    <div className="relative w-full h-full bg-black rounded-[12.8cqw] overflow-hidden border border-[#ffffff05] shadow-inner">
                        <Image
                            src={src}
                            alt={`Slide ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1280px) 100vw, 320px"
                            loading={isActive ? "eager" : "lazy"}
                            priority={isActive}
                            draggable={false}
                            onLoad={handleImageLoad}
                        />
                        <div
                            className="absolute inset-0 bg-black transition-opacity duration-700 pointer-events-none"
                            style={{ opacity: isActive ? 0 : 0.4 }}
                        />
                    </div>
                </div>
            </div>
        );
    },
);
CarouselCard.displayName = "CarouselCard";

const NavigationButton = ({
    direction,
    onClick,
    imagesLength,
    haptic,
}: {
    direction: "left" | "right";
    onClick: () => void;
    imagesLength: number;
    haptic: any;
}) => {
    const isLeft = direction === "left";
    return (
        <button
            type="button"
            className={cn(
                "absolute z-50 h-12 w-12 flex items-center justify-center rounded-full shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/60 border border-border/40 text-foreground hover:bg-background/80 transition-all hover:scale-110 outline-none touch-manipulation select-none opacity-100 visible",
                isLeft ? "left-4 xl:left-[calc(50%-250px)]" : "right-4 xl:right-[calc(50%-250px)]",
            )}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                haptic.trigger("selection");
                onClick();
            }}
            aria-label={isLeft ? "Previous slide" : "Next slide"}
        >
            {isLeft ? <ChevronLeft className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
        </button>
    );
};

const ThemeToggle = ({
    currentTheme,
    toggleTheme,
}: {
    currentTheme: string;
    toggleTheme: (e: React.MouseEvent) => void;
}) => (
    <div className="absolute bottom-4 left-4 xl:left-auto xl:right-4 z-50 flex flex-col items-center gap-2">
        <Badge
            variant="outline"
            shape="pill"
            className="bg-transparent border-none text-muted-foreground pointer-events-none select-none shadow-none"
        >
            App Theme
        </Badge>
        <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center p-1 rounded-full shadow-lg backdrop-blur bg-background/60 border border-border/40 cursor-pointer outline-none hover:bg-background/80 transition-colors"
            aria-label="Toggle image theme"
            style={{ viewTransitionName: "theme-toggle-button" } as React.CSSProperties}
        >
            <div
                className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300",
                    currentTheme === "light"
                        ? "bg-primary text-primary-foreground shadow-sm scale-110"
                        : "text-muted-foreground",
                )}
            >
                <Sun className="w-4 h-4" />
            </div>
            <div
                className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300",
                    currentTheme === "dark"
                        ? "bg-primary text-primary-foreground shadow-sm scale-110"
                        : "text-muted-foreground",
                )}
            >
                <Moon className="w-4 h-4" />
            </div>
        </button>
    </div>
);

type CarouselState = {
    active: number;
    isPaused: boolean;
    dragOffset: number;
    mounted: boolean;
    forcedTheme: "light" | "dark" | null;
    interactionPause: boolean;
};

type Action =
    | { type: "SET_ACTIVE"; payload: number }
    | { type: "SET_PAUSED"; payload: boolean }
    | { type: "SET_DRAG_OFFSET"; payload: number }
    | { type: "SET_MOUNTED" }
    | { type: "SET_FORCED_THEME"; payload: "light" | "dark" | null }
    | { type: "SET_INTERACTION_PAUSE"; payload: boolean }
    | { type: "NEXT_SLIDE"; total: number }
    | { type: "PREV_SLIDE"; total: number }
    | { type: "SNAP_SLIDE"; total: number };

function carouselReducer(state: CarouselState, action: Action): CarouselState {
    switch (action.type) {
        case "SET_ACTIVE": return { ...state, active: action.payload };
        case "SET_PAUSED": return { ...state, isPaused: action.payload };
        case "SET_DRAG_OFFSET": return { ...state, dragOffset: action.payload };
        case "SET_MOUNTED": return { ...state, mounted: true };
        case "SET_FORCED_THEME": return { ...state, forcedTheme: action.payload };
        case "SET_INTERACTION_PAUSE": return { ...state, interactionPause: action.payload };
        case "NEXT_SLIDE": return { ...state, active: (state.active + 1) % action.total };
        case "PREV_SLIDE": return { ...state, active: (state.active - 1 + action.total) % action.total };
        case "SNAP_SLIDE": {
            const snapped = Math.round(state.active + state.dragOffset);
            return { ...state, active: snapped, dragOffset: 0 };
        }
        default: return state;
    }
}

export function CoverflowCarousel({ images, className, autoScrollInterval = 3000 }: CoverflowCarouselProps) {
    const [state, dispatch] = useReducer(carouselReducer, {
        active: 0,
        isPaused: false,
        dragOffset: 0,
        mounted: false,
        forcedTheme: null,
        interactionPause: false,
    });

    const { resolvedTheme } = useTheme();
    const haptic = useMobileHaptics();
    const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const subscribe = useCallback(() => () => {}, []);
    const getSnapshot = useCallback(() => true, []);
    const getServerSnapshot = useCallback(() => false, []);
    const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const [lastTheme, setLastTheme] = useState(resolvedTheme);
    if (resolvedTheme !== lastTheme) {
        setLastTheme(resolvedTheme);
        dispatch({ type: "SET_FORCED_THEME", payload: null });
    }

    const currentTheme = state.forcedTheme || resolvedTheme || "light";

    const getImageUrl = useCallback((item: GalleryItem) => {
        if (typeof item === "string") return item;
        // Fallback to light if not mounted or theme not resolved yet
        if (!state.mounted || !resolvedTheme) return item.light;
        return currentTheme === "dark" ? item.dark : item.light;
    }, [state.mounted, resolvedTheme, currentTheme]);

    useEffect(() => {
        dispatch({ type: "SET_MOUNTED" });
    }, []);

    const triggerInteractionPause = useCallback(() => {
        dispatch({ type: "SET_INTERACTION_PAUSE", payload: true });
        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = setTimeout(() => {
            dispatch({ type: "SET_INTERACTION_PAUSE", payload: false });
        }, 3000);
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            dispatch({ type: "SET_PAUSED", payload: document.hidden });
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    useEffect(() => {
        if (state.isPaused || state.interactionPause) return;
        const interval = setInterval(() => {
            dispatch({ type: "NEXT_SLIDE", total: images.length });
        }, autoScrollInterval);
        return () => clearInterval(interval);
    }, [state.isPaused, state.interactionPause, images.length, autoScrollInterval]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                triggerInteractionPause();
                dispatch({ type: "PREV_SLIDE", total: images.length });
            } else if (e.key === "ArrowRight") {
                triggerInteractionPause();
                dispatch({ type: "NEXT_SLIDE", total: images.length });
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [images.length, triggerInteractionPause]);

    const touchStart = useRef<number | null>(null);
    const touchEnd = useRef<number | null>(null);
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
        if (Math.abs(distance) > minSwipeDistance) {
            haptic.trigger("selection");
            triggerInteractionPause();
            if (distance > 0) dispatch({ type: "NEXT_SLIDE", total: images.length });
            else dispatch({ type: "PREV_SLIDE", total: images.length });
        }
    }, [images.length, triggerInteractionPause, haptic]);

    const isDraggingRef = useRef(false);
    const mouseStart = useRef<number | null>(null);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        isDraggingRef.current = true;
        mouseStart.current = e.clientX;
    }, []);

    const onMouseUp = useCallback((e: React.MouseEvent) => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        if (mouseStart.current === null) return;
        const distance = mouseStart.current - e.clientX;
        if (Math.abs(distance) > minSwipeDistance) {
            haptic.trigger("selection");
            triggerInteractionPause();
            if (distance > 0) dispatch({ type: "NEXT_SLIDE", total: images.length });
            else dispatch({ type: "PREV_SLIDE", total: images.length });
        }
    }, [images.length, triggerInteractionPause, haptic]);

    const onPillDrag = useCallback((currentX: number, pillDragStart: number) => {
        const containerWidth = 1000; // Simplified for this example
        const totalSlides = Math.max(1, images.length - 1);
        const pixelsPerSlide = containerWidth / totalSlides;
        const offset = (currentX - pillDragStart) / pixelsPerSlide;
        const clampedOffset = Math.max(-state.active, Math.min(images.length - 1 - state.active, offset));
        dispatch({ type: "SET_DRAG_OFFSET", payload: clampedOffset });
    }, [images.length, state.active]);

    const handleCardClick = useCallback((index: number) => {
        if (index === state.active) return;
        haptic.trigger("selection");
        triggerInteractionPause();
        dispatch({ type: "SET_ACTIVE", payload: index });
    }, [state.active, triggerInteractionPause, haptic]);

    const toggleTheme = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        haptic.trigger("light");
        const switchTheme = () => {
            flushSync(() => {
                dispatch({
                    type: "SET_FORCED_THEME",
                    payload: currentTheme === "light" ? "dark" : "light"
                });
            });
        };
        if (!document.startViewTransition) { switchTheme(); return; }
        
        const transition = document.startViewTransition(switchTheme);
        
        transition.ready.then(() => {
            document.documentElement.animate(
                {
                    clipPath: ["inset(0 0 100% 0)", "inset(0 0 0 0)"],
                },
                {
                    duration: 700,
                    easing: "ease-in-out",
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        });
    }, [currentTheme, haptic]);

    const effectiveActive = Math.round(state.active + state.dragOffset);
    const normalizedActive = ((effectiveActive % images.length) + images.length) % images.length;

    return (
        <section
            role="region"
            aria-label="Image Carousel"
            className={cn("relative w-full max-w-6xl mx-auto py-12 xl:flex xl:flex-col", className)}
            onMouseEnter={() => dispatch({ type: "SET_PAUSED", payload: true })}
            onMouseLeave={() => dispatch({ type: "SET_PAUSED", payload: false })}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="relative w-full h-[800px] xl:h-auto xl:flex-1 xl:min-h-0 flex items-center justify-center [perspective:500px] [transform-style:preserve-3d] overflow-hidden">
                <NavigationButton direction="left" imagesLength={images.length} haptic={haptic} onClick={() => { triggerInteractionPause(); dispatch({ type: "PREV_SLIDE", total: images.length }); }} />
                
                {images.map((item, i) => {
                    const itemKey = typeof item === "string" ? item : item.light;
                    return (
                        <CarouselCard
                            key={itemKey}
                            src={getImageUrl(item)}
                            index={i}
                            active={effectiveActive}
                            total={images.length}
                            onClick={handleCardClick}
                            className="w-[260px] xl:w-auto xl:h-[80%] aspect-[1320/2868]"
                        />
                    );
                })}

                <NavigationButton direction="right" imagesLength={images.length} haptic={haptic} onClick={() => { triggerInteractionPause(); dispatch({ type: "NEXT_SLIDE", total: images.length }); }} />

                {images.some((img) => typeof img !== "string") && (
                    <ThemeToggle currentTheme={currentTheme} toggleTheme={toggleTheme} />
                )}

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-50">
                    {images.map((img, idx) => {
                        const dotKey = typeof img === "string" ? img : img.light;
                        return (
                            <button
                                key={`dot-${dotKey}`}
                                type="button"
                                onClick={(e) => { e.preventDefault(); triggerInteractionPause(); dispatch({ type: "SET_ACTIVE", payload: idx }); }}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    idx === normalizedActive ? "bg-primary w-8" : "bg-primary/20 w-2 hover:bg-primary/40"
                                )}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
