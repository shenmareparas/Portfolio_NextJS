"use client";

import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import {
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    RotateCcw,
} from "lucide-react";
import { GalleryItem } from "@/types/project";
import { cn } from "@/lib/utils";
import { useMobileHaptics } from "@/hooks/use-mobile-haptics";

interface VerticalGalleryProps {
    images: GalleryItem[];
    title: string;
    className?: string;
}

const MIN_SCALE = 1;
const MAX_SCALE = 3.5;
const SCALE_STEP = 0.5;

const emptySubscribe = () => () => {};

export function VerticalGallery({
    images,
    title,
    className,
}: VerticalGalleryProps) {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({
        x: 0,
        y: 0,
        posX: 0,
        posY: 0,
    });
    const isDragMovedRef = useRef(false);

    const { resolvedTheme } = useTheme();
    const { trigger } = useMobileHaptics();

    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    const isDark = mounted && resolvedTheme === "dark";

    const getImageUrl = useCallback(
        (item: GalleryItem) => {
            if (typeof item === "string") return item;
            return isDark ? item.dark : item.light;
        },
        [isDark]
    );

    const resetZoom = useCallback(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, []);

    const handleOpen = useCallback(
        (idx: number) => {
            setSelectedIdx(idx);
            resetZoom();
            trigger("selection");
        },
        [resetZoom, trigger]
    );

    const handleClose = useCallback(() => {
        setSelectedIdx(null);
        resetZoom();
        trigger("selection");
    }, [resetZoom, trigger]);

    const handleViewportClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target !== e.currentTarget) {
                return;
            }
            if (isDragMovedRef.current) {
                isDragMovedRef.current = false;
                return;
            }
            handleClose();
        },
        [handleClose]
    );

    const handleImageClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const handleZoomIn = useCallback(
        (e?: React.MouseEvent | React.PointerEvent) => {
            if (e) {
                e.stopPropagation();
            }
            setScale((prev) => {
                const next = Math.min(
                    MAX_SCALE,
                    Math.round((prev + SCALE_STEP) * 10) / 10
                );
                return next;
            });
            trigger("impactLight");
        },
        [trigger]
    );

    const handleZoomOut = useCallback(
        (e?: React.MouseEvent | React.PointerEvent) => {
            if (e) {
                e.stopPropagation();
            }
            setScale((prev) => {
                const next = Math.max(
                    MIN_SCALE,
                    Math.round((prev - SCALE_STEP) * 10) / 10
                );
                if (next === 1) setPosition({ x: 0, y: 0 });
                return next;
            });
            trigger("impactLight");
        },
        [trigger]
    );

    const handleToggleZoom = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (scale > 1) {
                resetZoom();
            } else {
                setScale(2);
            }
            trigger("selection");
        },
        [scale, resetZoom, trigger]
    );

    const handlePrev = useCallback(
        (e?: React.MouseEvent | React.PointerEvent) => {
            if (e) e.stopPropagation();
            if (images.length === 0) return;
            resetZoom();
            setSelectedIdx((prev) =>
                prev === null ? null : (prev - 1 + images.length) % images.length
            );
            trigger("selection");
        },
        [images.length, resetZoom, trigger]
    );

    const handleNext = useCallback(
        (e?: React.MouseEvent | React.PointerEvent) => {
            if (e) e.stopPropagation();
            if (images.length === 0) return;
            resetZoom();
            setSelectedIdx((prev) =>
                prev === null ? null : (prev + 1) % images.length
            );
            trigger("selection");
        },
        [images.length, resetZoom, trigger]
    );

    // Keyboard navigation & zoom shortcuts
    useEffect(() => {
        if (selectedIdx === null) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (scale > 1) {
                    resetZoom();
                } else {
                    handleClose();
                }
            } else if (e.key === "ArrowLeft") {
                if (scale === 1) handlePrev();
            } else if (e.key === "ArrowRight") {
                if (scale === 1) handleNext();
            } else if (e.key === "+" || e.key === "=") {
                handleZoomIn();
            } else if (e.key === "-" || e.key === "_") {
                handleZoomOut();
            } else if (e.key === "0") {
                resetZoom();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [
        selectedIdx,
        scale,
        handleClose,
        handlePrev,
        handleNext,
        handleZoomIn,
        handleZoomOut,
        resetZoom,
    ]);

    const modalRef = useRef<HTMLDivElement | null>(null);

    // Native non-passive wheel & gesture listeners to reliably prevent browser viewport pinch-to-zoom
    useEffect(() => {
        if (selectedIdx === null) return;

        const modalEl = modalRef.current;
        if (!modalEl) return;

        const handleNativeWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const sensitivity = e.ctrlKey ? 0.0085 : 0.003;
            const delta = -e.deltaY * sensitivity;

            setScale((prev) => {
                const next = Math.min(
                    MAX_SCALE,
                    Math.max(MIN_SCALE, Math.round((prev + delta) * 100) / 100)
                );
                if (next === MIN_SCALE) {
                    setPosition({ x: 0, y: 0 });
                }
                return next;
            });
        };

        const preventGesture = (e: Event) => {
            e.preventDefault();
        };

        modalEl.addEventListener("wheel", handleNativeWheel, { passive: false });
        modalEl.addEventListener("gesturestart", preventGesture, { passive: false });
        modalEl.addEventListener("gesturechange", preventGesture, { passive: false });
        modalEl.addEventListener("gestureend", preventGesture, { passive: false });

        return () => {
            modalEl.removeEventListener("wheel", handleNativeWheel);
            modalEl.removeEventListener("gesturestart", preventGesture);
            modalEl.removeEventListener("gesturechange", preventGesture);
            modalEl.removeEventListener("gestureend", preventGesture);
        };
    }, [selectedIdx]);

    // Pan / Drag handlers when zoomed in
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        isDragMovedRef.current = false;
        if (scale <= 1 || e.button !== 0) return;
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            posX: position.x,
            posY: position.y,
        };
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || scale <= 1) return;
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            isDragMovedRef.current = true;
            if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
                try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                } catch {
                    // Ignore
                }
            }
        }
        setPosition({
            x: dragStartRef.current.posX + dx,
            y: dragStartRef.current.posY + dy,
        });
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDragging) {
            setIsDragging(false);
            try {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                }
            } catch {
                // Ignore capture release error
            }
        }
    };

    if (!images || images.length === 0) return null;

    const activeImageSrc =
        selectedIdx !== null ? getImageUrl(images[selectedIdx]) : null;

    return (
        <>
            <div
                className={cn(
                    "w-full h-full xl:overflow-y-auto xl:px-8 xl:py-6 space-y-6 md:space-y-8",
                    className
                )}
            >
                {images.map((item, idx) => {
                    const src = getImageUrl(item);
                    return (
                        <m.button
                            type="button"
                            key={idx}
                            onClick={() => handleOpen(idx)}
                            whileHover={{
                                y: -8,
                                scale: 1.02,
                                transition: { duration: 0.2 },
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative w-full text-left rounded-2xl overflow-hidden border border-border/40 bg-zinc-900/5 dark:bg-zinc-900/40 transition-shadow duration-300 hover:shadow-xl dark:hover:shadow-2xl cursor-zoom-in cursor-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary block"
                            aria-label={`Open ${title} screenshot ${idx + 1} in full screen`}
                        >
                            {/* Dynamic Border Glow (matching projects page) */}
                            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none z-20">
                                <div className="absolute inset-0 border-2 border-primary rounded-2xl opacity-40" />
                                <div className="absolute inset-0 bg-primary opacity-[0.03] rounded-2xl" />
                            </div>

                            <div className="relative w-full rounded-2xl bg-muted/20">
                                <Image
                                    src={src}
                                    alt={`${title} screenshot ${idx + 1}`}
                                    width={1920}
                                    height={1080}
                                    sizes="(max-width: 1280px) 100vw, 50vw"
                                    className="w-full h-auto object-contain rounded-2xl"
                                    loading={idx === 0 ? "eager" : "lazy"}
                                    priority={idx === 0}
                                />
                            </div>
                        </m.button>
                    );
                })}
            </div>

            {/* Full Screen Lightbox Modal */}
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {selectedIdx !== null && activeImageSrc && (
                            <m.div
                                ref={modalRef}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md select-none overflow-hidden"
                                role="dialog"
                                aria-modal="true"
                                aria-label="Fullscreen screenshot view"
                            >
                                {/* Interactive Image Viewport & Backdrop */}
                                <div
                                    onClick={handleViewportClick}
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    onPointerCancel={handlePointerUp}
                                    className={cn(
                                        "relative z-10 w-full h-full flex items-center justify-center p-4 md:p-8 touch-none",
                                        scale > 1
                                            ? isDragging
                                                ? "cursor-grabbing"
                                                : "cursor-grab"
                                            : "cursor-default"
                                    )}
                                >
                                    <m.div
                                        key={selectedIdx}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center select-none pointer-events-none"
                                    >
                                        <div
                                            onClick={handleImageClick}
                                            onDoubleClick={handleToggleZoom}
                                            style={{
                                                transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${scale})`,
                                                transformOrigin: "center center",
                                                transition: isDragging
                                                    ? "none"
                                                    : "transform 0.2s cubic-bezier(0.2, 0, 0, 1)",
                                            }}
                                            className={cn(
                                                "relative flex items-center justify-center will-change-transform select-none pointer-events-auto",
                                                scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
                                            )}
                                        >
                                            <Image
                                                src={activeImageSrc}
                                                alt={`${title} screenshot ${selectedIdx + 1}`}
                                                width={2560}
                                                height={1440}
                                                sizes="95vw"
                                                className="max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain rounded-xl shadow-2xl pointer-events-none select-none"
                                                priority
                                                draggable={false}
                                            />
                                        </div>
                                    </m.div>
                                </div>

                                {/* Floating Top Controls Toolbar */}
                                <div
                                    className="fixed top-4 right-4 z-50 flex items-center gap-1.5 p-1.5 rounded-full bg-zinc-900/90 backdrop-blur-md border border-white/20 shadow-2xl pointer-events-auto"
                                    onClick={(e) => e.stopPropagation()}
                                    onPointerDown={(e) => e.stopPropagation()}
                                >
                                    {/* Zoom Out Button */}
                                    <button
                                        type="button"
                                        onClick={handleZoomOut}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        disabled={scale <= MIN_SCALE}
                                        className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer cursor-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                        aria-label="Zoom out"
                                        title="Zoom out (-)"
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </button>

                                    {/* Zoom Level Indicator / Reset Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetZoom();
                                            trigger("selection");
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        className="px-2.5 py-1 rounded-full text-xs font-semibold text-white/90 hover:bg-white/10 transition-colors cursor-pointer cursor-hover flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                        aria-label="Reset zoom to 100%"
                                        title="Reset zoom (0)"
                                    >
                                        <span>{Math.round(scale * 100)}%</span>
                                        {scale !== 1 && (
                                            <RotateCcw className="w-3 h-3 text-white/70" />
                                        )}
                                    </button>

                                    {/* Zoom In Button */}
                                    <button
                                        type="button"
                                        onClick={handleZoomIn}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        disabled={scale >= MAX_SCALE}
                                        className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer cursor-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                        aria-label="Zoom in"
                                        title="Zoom in (+)"
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </button>

                                    <div className="w-px h-4 bg-white/20 mx-0.5" />

                                    {/* Close Button */}
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer cursor-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                        aria-label="Close full screen view"
                                        title="Close (Esc)"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Previous / Next Navigation Arrows */}
                                {images.length > 1 && scale === 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handlePrev}
                                            onPointerDown={(e) => e.stopPropagation()}
                                            className="fixed left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white transition-colors duration-200 cursor-pointer cursor-hover border border-white/20 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white pointer-events-auto"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            onPointerDown={(e) => e.stopPropagation()}
                                            className="fixed right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white transition-colors duration-200 cursor-pointer cursor-hover border border-white/20 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white pointer-events-auto"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                        {/* Slide Counter Badge */}
                                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-zinc-900/90 text-white/90 text-xs font-semibold tracking-wider backdrop-blur-md border border-white/20 shadow-lg select-none pointer-events-none">
                                            {selectedIdx + 1} / {images.length}
                                        </div>
                                    </>
                                )}
                            </m.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </>
    );
}
