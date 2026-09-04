"use client";

import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useSyncExternalStore,
    useReducer,
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

const MIN_SCALE = 1;      // hard floor — never zoom below 100%
const MAX_SCALE = 3;      // hard ceiling — max zoom 300%
const SCALE_STEP = 0.5;
// Strip animation duration in ms — must match CSS transition below
const STRIP_ANIM_MS = 320;
const SLOT_STYLE = { width: "calc(100% / 3)" } as const;

const emptySubscribe = () => () => {};

function getGalleryItemKey(item: GalleryItem, index: number): string {
    if (typeof item === "string") return item;
    return `${item.light}-${item.dark}-${index}`;
}

interface LightboxControlsProps {
    scale: number;
    imagesCount: number;
    selectedIdx: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

function LightboxControls({
    scale,
    imagesCount,
    selectedIdx,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    onClose,
    onPrev,
    onNext,
}: LightboxControlsProps) {
    return (
        <>
            <header
                className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-zinc-900/90 backdrop-blur-md border border-white/20 shadow-2xl pointer-events-auto max-w-[calc(100vw-1.5rem)]"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label="Image zoom and dialog controls"
            >
                <button
                    type="button"
                    onClick={onZoomOut}
                    onPointerDown={(e) => e.stopPropagation()}
                    disabled={scale <= MIN_SCALE}
                    className="min-w-10 min-h-10 sm:min-w-9 sm:min-h-9 p-2 rounded-full text-white/80 hover:text-white active:bg-white/20 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer cursor-hover flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white touch-manipulation"
                    aria-label="Zoom out"
                    title="Zoom out (-)"
                >
                    <ZoomOut className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={onResetZoom}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="min-h-10 sm:min-h-9 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold text-white/90 active:bg-white/20 hover:bg-white/10 transition-colors cursor-pointer cursor-hover flex items-center gap-1 sm:gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white touch-manipulation tabular-nums"
                    aria-label="Reset zoom to 100%"
                    title="Reset zoom (0)"
                >
                    <span>{Math.round(scale * 100)}%</span>
                    {scale !== 1 && <RotateCcw className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-white/70" />}
                </button>

                <button
                    type="button"
                    onClick={onZoomIn}
                    onPointerDown={(e) => e.stopPropagation()}
                    disabled={scale >= MAX_SCALE}
                    className="min-w-10 min-h-10 sm:min-w-9 sm:min-h-9 p-2 rounded-full text-white/80 hover:text-white active:bg-white/20 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer cursor-hover flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white touch-manipulation"
                    aria-label="Zoom in"
                    title="Zoom in (+)"
                >
                    <ZoomIn className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-white/20 mx-0.5" />

                <button
                    type="button"
                    onClick={onClose}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="min-w-10 min-h-10 sm:min-w-9 sm:min-h-9 p-2 rounded-full text-white/80 hover:text-white active:bg-white/20 hover:bg-white/15 transition-colors cursor-pointer cursor-hover flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white touch-manipulation"
                    aria-label="Close full screen view"
                    title="Close (Esc)"
                >
                    <X className="w-4 h-4" />
                </button>
            </header>

            {imagesCount > 1 && scale === 1 && (
                <>
                    <button
                        type="button"
                        onClick={onPrev}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 active:bg-zinc-700 text-white transition-colors duration-200 cursor-pointer cursor-hover border border-white/20 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white pointer-events-auto touch-manipulation"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                        type="button"
                        onClick={onNext}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 active:bg-zinc-700 text-white transition-colors duration-200 cursor-pointer cursor-hover border border-white/20 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white pointer-events-auto touch-manipulation"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-3.5 sm:px-4 py-1.5 rounded-full bg-zinc-900/90 text-white/90 text-xs font-semibold tracking-wider backdrop-blur-md border border-white/20 shadow-lg select-none pointer-events-none tabular-nums">
                        {selectedIdx + 1} / {imagesCount}
                    </div>
                </>
            )}
        </>
    );
}

interface LightboxModalProps {
    images: GalleryItem[];
    initialIdx: number;
    title: string;
    isDark: boolean;
    onClose: () => void;
}

interface LightboxState {
    activeIdx: number;
    scale: number;
    position: { x: number; y: number };
    isInteracting: boolean;
    stripOffset: number;
    isStripAnimating: boolean;
    dismissY: number;
    dismissProgress: number;
}

type LightboxAction =
    | { type: "RESET_ZOOM" }
    | { type: "SET_SCALE"; scale: number }
    | { type: "SET_ZOOM"; scale: number; position: { x: number; y: number } }
    | { type: "SET_POSITION"; position: { x: number; y: number } }
    | { type: "SET_INTERACTING"; isInteracting: boolean }
    | { type: "NAVIGATE_START"; stripOffset: number }
    | { type: "NAVIGATE_END"; newIdx: number }
    | { type: "SNAP_STRIP_START" }
    | { type: "SNAP_STRIP_END" }
    | { type: "SET_STRIP_OFFSET"; offset: number }
    | { type: "SET_DISMISS"; dismissY: number; dismissProgress: number }
    | { type: "RESET_DISMISS" };

function createInitialLightboxState(initialIdx: number): LightboxState {
    return {
        activeIdx: initialIdx,
        scale: 1,
        position: { x: 0, y: 0 },
        isInteracting: false,
        stripOffset: 0,
        isStripAnimating: false,
        dismissY: 0,
        dismissProgress: 0,
    };
}

function lightboxReducer(state: LightboxState, action: LightboxAction): LightboxState {
    switch (action.type) {
        case "RESET_ZOOM":
            return { ...state, scale: 1, position: { x: 0, y: 0 } };
        case "SET_SCALE":
            return { ...state, scale: action.scale };
        case "SET_ZOOM":
            return { ...state, scale: action.scale, position: action.position };
        case "SET_POSITION":
            return { ...state, position: action.position };
        case "SET_INTERACTING":
            return { ...state, isInteracting: action.isInteracting };
        case "NAVIGATE_START":
            return { ...state, isStripAnimating: true, stripOffset: action.stripOffset };
        case "NAVIGATE_END":
            return {
                ...state,
                isStripAnimating: false,
                stripOffset: 0,
                activeIdx: action.newIdx,
                scale: 1,
                position: { x: 0, y: 0 },
            };
        case "SNAP_STRIP_START":
            return { ...state, isStripAnimating: true, stripOffset: 0 };
        case "SNAP_STRIP_END":
            return { ...state, isStripAnimating: false };
        case "SET_STRIP_OFFSET":
            return { ...state, stripOffset: action.offset };
        case "SET_DISMISS":
            return { ...state, dismissY: action.dismissY, dismissProgress: action.dismissProgress };
        case "RESET_DISMISS":
            return { ...state, dismissY: 0, dismissProgress: 0 };
        default:
            return state;
    }
}

interface UseLightboxGesturesParams {
    modalRef: React.RefObject<HTMLDivElement | null>;
    viewportRef: React.RefObject<HTMLDivElement | null>;
    imgWrapperRef: React.RefObject<HTMLDivElement | null>;
    scaleRef: React.RefObject<number>;
    positionRef: React.RefObject<{ x: number; y: number }>;
    activeIdxRef: React.RefObject<number>;
    stripOffsetRef: React.RefObject<number>;
    isStripAnimatingRef: React.RefObject<boolean>;
    isDragMovedRef: React.RefObject<boolean>;
    lastTapRef: React.RefObject<number>;
    lastTapPosRef: React.RefObject<{ x: number; y: number }>;
    lastTouchDoubleTapTimeRef: React.RefObject<number>;
    actionsRef: React.RefObject<{
        handleClose: () => void;
        handleZoomIn: () => void;
        handleZoomOut: () => void;
        resetZoom: () => void;
        clampPosition: (targetScale: number, pos: { x: number; y: number }) => { x: number; y: number };
        trigger: ReturnType<typeof useMobileHaptics>["trigger"];
        navigateTo: (newIdx: number, direction: "prev" | "next") => void;
        count: number;
    }>;
    dispatch: React.Dispatch<LightboxAction>;
}

function useLightboxGestures({
    modalRef,
    viewportRef,
    imgWrapperRef,
    scaleRef,
    positionRef,
    activeIdxRef,
    stripOffsetRef,
    isStripAnimatingRef,
    isDragMovedRef,
    lastTapRef,
    lastTapPosRef,
    lastTouchDoubleTapTimeRef,
    actionsRef,
    dispatch,
}: UseLightboxGesturesParams) {
    // Body scroll lock + keyboard shortcuts
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            const a = actionsRef.current;
            const idx = activeIdxRef.current;
            const c = a.count;
            if (e.key === "Escape") {
                if (scaleRef.current > 1) a.resetZoom();
                else a.handleClose();
            } else if (e.key === "ArrowLeft" && scaleRef.current === 1) {
                a.navigateTo((idx - 1 + c) % c, "prev");
            } else if (e.key === "ArrowRight" && scaleRef.current === 1) {
                a.navigateTo((idx + 1) % c, "next");
            } else if (e.key === "+" || e.key === "=") {
                a.handleZoomIn();
            } else if (e.key === "-" || e.key === "_") {
                a.handleZoomOut();
            } else if (e.key === "0") {
                a.resetZoom();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [actionsRef, activeIdxRef, scaleRef]);

    // Non-passive wheel zoom + iOS gesture prevention
    useEffect(() => {
        const modalEl = modalRef.current;
        if (!modalEl) return;

        const handleNativeWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const sensitivity = e.ctrlKey ? 0.0085 : 0.003;
            const delta = -e.deltaY * sensitivity;
            const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round((scaleRef.current + delta) * 100) / 100));
            scaleRef.current = next;
            if (next <= 1) {
                positionRef.current = { x: 0, y: 0 };
                dispatch({ type: "SET_ZOOM", scale: 1, position: { x: 0, y: 0 } });
            } else {
                const clamped = actionsRef.current.clampPosition(next, positionRef.current);
                positionRef.current = clamped;
                dispatch({ type: "SET_ZOOM", scale: next, position: clamped });
            }
        };

        const preventGesture = (e: Event) => e.preventDefault();

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
    }, [actionsRef, dispatch, modalRef, positionRef, scaleRef]);

    // Main pointer-gesture engine
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const activePointers = new Map<number, { x: number; y: number }>();
        let pinchStartDistance = 0;
        let pinchStartScale    = 1;
        let pinchStartFocal    = { x: 0, y: 0 };
        let pinchStartPosition = { x: 0, y: 0 };
        let panStartPos        = { x: 0, y: 0 };
        let panStartPointer    = { x: 0, y: 0 };
        let dismissDistY       = 0;
        type GT = "none" | "swipe-x" | "dismiss-y" | "pinch";
        let gestureType: GT   = "none";
        let lastMoveTime      = 0;
        let lastMoveX         = 0;
        let velocityX         = 0;
        let pointerDownTime   = 0;

        const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
            Math.hypot(p1.x - p2.x, p1.y - p2.y);

        const getCenter = (p1: { x: number; y: number }, p2: { x: number; y: number }) => ({
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
        });

        const snapStripBack = () => {
            isStripAnimatingRef.current = true;
            stripOffsetRef.current = 0;
            dispatch({ type: "SNAP_STRIP_START" });
            setTimeout(() => {
                isStripAnimatingRef.current = false;
                dispatch({ type: "SNAP_STRIP_END" });
            }, STRIP_ANIM_MS);
        };

        const onPointerDown = (e: PointerEvent) => {
            if (isStripAnimatingRef.current) return;
            activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

            if (e.pointerType === "touch" && activePointers.size === 2) {
                const pts = Array.from(activePointers.values());
                pinchStartDistance = getDistance(pts[0], pts[1]);
                pinchStartScale    = scaleRef.current;
                pinchStartPosition = { ...positionRef.current };
                const rect   = viewport.getBoundingClientRect();
                const center = getCenter(pts[0], pts[1]);
                pinchStartFocal = {
                    x: center.x - rect.left - rect.width  / 2,
                    y: center.y - rect.top  - rect.height / 2,
                };
                gestureType = "pinch";
                isDragMovedRef.current = true;
                dispatch({ type: "SET_INTERACTING", isInteracting: true });
                return;
            }

            if (activePointers.size === 1) {
                pointerDownTime = Date.now();
                isDragMovedRef.current = false;
                panStartPointer = { x: e.clientX, y: e.clientY };
                panStartPos     = { ...positionRef.current };
                gestureType     = "none";
                dismissDistY    = 0;
                velocityX       = 0;
                lastMoveTime    = Date.now();
                lastMoveX       = e.clientX;
                if (scaleRef.current > 1) dispatch({ type: "SET_INTERACTING", isInteracting: true });
            }
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!activePointers.has(e.pointerId)) return;
            activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

            if (e.pointerType === "touch" && activePointers.size === 2 && pinchStartDistance > 0) {
                const pts             = Array.from(activePointers.values());
                const currentDistance = getDistance(pts[0], pts[1]);
                const center          = getCenter(pts[0], pts[1]);
                const rect            = viewport.getBoundingClientRect();
                const currentFocal    = {
                    x: center.x - rect.left - rect.width  / 2,
                    y: center.y - rect.top  - rect.height / 2,
                };

                const rawScale = pinchStartScale * (currentDistance / pinchStartDistance);
                const rubbered = rawScale > MAX_SCALE
                    ? MAX_SCALE + (rawScale - MAX_SCALE) * 0.25
                    : rawScale;
                const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE + 0.5, rubbered));

                const scaleRatio = newScale / pinchStartScale;
                const newX = currentFocal.x - (pinchStartFocal.x - pinchStartPosition.x) * scaleRatio;
                const newY = currentFocal.y - (pinchStartFocal.y - pinchStartPosition.y) * scaleRatio;

                scaleRef.current    = newScale;
                positionRef.current = { x: newX, y: newY };
                dispatch({ type: "SET_ZOOM", scale: newScale, position: { x: newX, y: newY } });
                isDragMovedRef.current = true;
                return;
            }

            if (activePointers.size !== 1) return;

            const dx  = e.clientX - panStartPointer.x;
            const dy  = e.clientY - panStartPointer.y;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);
            const now = Date.now();
            const dt  = now - lastMoveTime;
            if (dt > 0) velocityX = (e.clientX - lastMoveX) / dt;
            lastMoveTime = now;
            lastMoveX    = e.clientX;

            if (absDx > 16 || absDy > 16) isDragMovedRef.current = true;

            if (scaleRef.current > 1) {
                if (absDx > 10 || absDy > 10) {
                    isDragMovedRef.current = true;
                    positionRef.current = { x: panStartPos.x + dx, y: panStartPos.y + dy };
                    dispatch({ type: "SET_POSITION", position: { x: panStartPos.x + dx, y: panStartPos.y + dy } });
                }
                return;
            }

            if (e.pointerType !== "touch") return;

            if (gestureType === "none") {
                if (absDx > absDy && absDx > 16) {
                    gestureType = "swipe-x";
                    dispatch({ type: "SET_INTERACTING", isInteracting: true });
                } else if (dy > 0 && absDy > absDx && absDy > 16) {
                    gestureType = "dismiss-y";
                    dispatch({ type: "SET_INTERACTING", isInteracting: true });
                }
            }

            if (gestureType === "swipe-x" && actionsRef.current.count > 1) {
                stripOffsetRef.current = dx;
                dispatch({ type: "SET_STRIP_OFFSET", offset: dx });
            } else if (gestureType === "dismiss-y") {
                dismissDistY = dy;
                const progress = Math.min(1, Math.abs(dy) / 280);
                dispatch({ type: "SET_DISMISS", dismissY: dy, dismissProgress: progress });
            }
        };

        const onPointerUp = (e: PointerEvent) => {
            activePointers.delete(e.pointerId);

            if (e.pointerType === "touch" && activePointers.size === 1) {
                const remaining = Array.from(activePointers.values())[0];
                panStartPointer    = { x: remaining.x, y: remaining.y };
                panStartPos        = { ...positionRef.current };
                gestureType        = "none";
                pinchStartDistance = 0;
                return;
            }

            if (activePointers.size > 0) return;

            if (e.pointerType === "touch" && gestureType === "none") {
                const dxFromStart   = Math.abs(e.clientX - panStartPointer.x);
                const dyFromStart   = Math.abs(e.clientY - panStartPointer.y);
                const touchDuration = Date.now() - pointerDownTime;
                const isQuickTap    = touchDuration < 350 && dxFromStart < 24 && dyFromStart < 24;

                if (isQuickTap) {
                    const now          = Date.now();
                    const timeDiff     = now - lastTapRef.current;
                    const distFromLast = Math.hypot(
                        e.clientX - lastTapPosRef.current.x,
                        e.clientY - lastTapPosRef.current.y
                    );

                    if (timeDiff < 400 && timeDiff > 40 && distFromLast < 45) {
                        lastTouchDoubleTapTimeRef.current = Date.now();
                        lastTapRef.current = 0;
                        gestureType        = "none";

                        const rect = viewport.getBoundingClientRect();
                        const tapX = e.clientX - rect.left - rect.width  / 2;
                        const tapY = e.clientY - rect.top  - rect.height / 2;

                        if (scaleRef.current > 1.05) {
                            dispatch({ type: "SET_INTERACTING", isInteracting: false });
                            actionsRef.current.resetZoom();
                            actionsRef.current.trigger("selection");
                        } else {
                            dispatch({ type: "SET_INTERACTING", isInteracting: false });
                            const targetScale = 2.4;
                            const targetPos   = actionsRef.current.clampPosition(targetScale, {
                                x: -tapX * (targetScale - 1),
                                y: -tapY * (targetScale - 1),
                            });
                            scaleRef.current    = targetScale;
                            positionRef.current = targetPos;
                            dispatch({ type: "SET_ZOOM", scale: targetScale, position: targetPos });
                            actionsRef.current.trigger("selection");
                        }
                        return;
                    }

                    lastTapRef.current    = now;
                    lastTapPosRef.current = { x: e.clientX, y: e.clientY };
                }
            }

            dispatch({ type: "SET_INTERACTING", isInteracting: false });

            if (gestureType === "swipe-x") {
                const currentOffset  = stripOffsetRef.current;
                const vw             = viewport.clientWidth;
                const shouldNavigate = Math.abs(currentOffset) > vw * 0.3 || Math.abs(velocityX) > 0.4;
                const c              = actionsRef.current.count;

                if (shouldNavigate && currentOffset > 0) {
                    actionsRef.current.navigateTo((activeIdxRef.current - 1 + c) % c, "prev");
                } else if (shouldNavigate && currentOffset < 0) {
                    actionsRef.current.navigateTo((activeIdxRef.current + 1) % c, "next");
                } else {
                    snapStripBack();
                }

            } else if (gestureType === "dismiss-y") {
                if (Math.abs(dismissDistY) > 90) {
                    actionsRef.current.trigger("light");
                    actionsRef.current.handleClose();
                    return;
                }
                dispatch({ type: "RESET_DISMISS" });
                dismissDistY = 0;

            } else if (gestureType === "pinch") {
                const targetScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scaleRef.current));

                if (targetScale <= 1) {
                    scaleRef.current    = 1;
                    positionRef.current = { x: 0, y: 0 };
                    dispatch({ type: "SET_ZOOM", scale: 1, position: { x: 0, y: 0 } });
                } else {
                    scaleRef.current = targetScale;
                    const clamped       = actionsRef.current.clampPosition(targetScale, positionRef.current);
                    positionRef.current = clamped;
                    dispatch({ type: "SET_ZOOM", scale: targetScale, position: clamped });
                }

            } else {
                if (scaleRef.current <= 1) {
                    dispatch({ type: "RESET_DISMISS" });
                    positionRef.current = { x: 0, y: 0 };
                    dispatch({ type: "SET_POSITION", position: { x: 0, y: 0 } });
                } else {
                    const clamped       = actionsRef.current.clampPosition(scaleRef.current, positionRef.current);
                    positionRef.current = clamped;
                    dispatch({ type: "SET_POSITION", position: clamped });
                }
            }

            gestureType        = "none";
            pinchStartDistance = 0;
        };

        viewport.addEventListener("pointerdown",   onPointerDown);
        viewport.addEventListener("pointermove",   onPointerMove);
        viewport.addEventListener("pointerup",     onPointerUp);
        viewport.addEventListener("pointercancel", onPointerUp);

        return () => {
            viewport.removeEventListener("pointerdown",   onPointerDown);
            viewport.removeEventListener("pointermove",   onPointerMove);
            viewport.removeEventListener("pointerup",     onPointerUp);
            viewport.removeEventListener("pointercancel", onPointerUp);
        };
    }, [actionsRef, dispatch, imgWrapperRef, isDragMovedRef, isStripAnimatingRef, lastTapPosRef, lastTapRef, lastTouchDoubleTapTimeRef, positionRef, scaleRef, stripOffsetRef, viewportRef, activeIdxRef]);
}

interface LightboxStripProps {
    viewportRef: React.RefObject<HTMLDivElement | null>;
    imgWrapperRef: React.RefObject<HTMLDivElement | null>;
    scale: number;
    position: { x: number; y: number };
    isInteracting: boolean;
    dismissY: number;
    dismissProgress: number;
    stripOffset: number;
    isStripAnimating: boolean;
    images: GalleryItem[];
    activeIdx: number;
    prevIdx: number;
    nextIdx: number;
    count: number;
    title: string;
    getImageSrc: (item: GalleryItem) => string;
    onImageDoubleClick: (e: React.MouseEvent) => void;
}

function LightboxStrip({
    viewportRef,
    imgWrapperRef,
    scale,
    position,
    isInteracting,
    dismissY,
    dismissProgress,
    stripOffset,
    isStripAnimating,
    images,
    activeIdx,
    prevIdx,
    nextIdx,
    count,
    title,
    getImageSrc,
    onImageDoubleClick,
}: LightboxStripProps) {
    const imgClass  = "max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain rounded-xl shadow-2xl pointer-events-none select-none";
    const slotClass = "flex-shrink-0 h-full flex items-center justify-center p-2 sm:p-4 md:p-8";

    return (
        <div
            ref={viewportRef}
            className={cn(
                "w-full h-full overflow-hidden touch-none",
                scale > 1 ? (isInteracting ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
            )}
            style={{
                transform: `translateY(${dismissY}px) scale(${1 - dismissProgress * 0.06})`,
                transformOrigin: "center center",
                transition: isInteracting
                    ? "none"
                    : "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                willChange: isInteracting ? "transform" : "auto",
            }}
        >
            <div
                className="flex h-full"
                style={{
                    width: "300%",
                    transform: `translateX(calc(-100% / 3 + ${stripOffset}px))`,
                    transition: isStripAnimating
                        ? `transform ${STRIP_ANIM_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`
                        : "none",
                    willChange: isStripAnimating ? "transform" : "auto",
                }}
            >
                <div className={slotClass} style={SLOT_STYLE}>
                    {count > 1 && (
                        <Image
                            src={getImageSrc(images[prevIdx])}
                            alt={`${title} screenshot ${prevIdx + 1}`}
                            width={2560}
                            height={1440}
                            sizes="95vw"
                            className={imgClass}
                            loading="eager"
                            draggable={false}
                        />
                    )}
                </div>

                <div className={slotClass} style={SLOT_STYLE}>
                    <div
                        ref={imgWrapperRef}
                        onDoubleClick={onImageDoubleClick}
                        className={cn(
                            "relative max-w-[95vw] max-h-[90vh] flex items-center justify-center select-none pointer-events-auto",
                            scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
                        )}
                        style={{
                            transform: `translate3d(${position.x}px,${position.y}px,0) scale(${scale})`,
                            transformOrigin: "center center",
                            willChange: isInteracting ? "transform" : "auto",
                            transition: isInteracting
                                ? "none"
                                : "transform 0.24s cubic-bezier(0.25, 1, 0.5, 1)",
                        }}
                    >
                        <Image
                            src={getImageSrc(images[activeIdx])}
                            alt={`${title} screenshot ${activeIdx + 1}`}
                            width={2560}
                            height={1440}
                            sizes="95vw"
                            className={imgClass}
                            priority
                            draggable={false}
                        />
                    </div>
                </div>

                <div className={slotClass} style={SLOT_STYLE}>
                    {count > 1 && (
                        <Image
                            src={getImageSrc(images[nextIdx])}
                            alt={`${title} screenshot ${nextIdx + 1}`}
                            width={2560}
                            height={1440}
                            sizes="95vw"
                            className={imgClass}
                            loading="eager"
                            draggable={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function LightboxModal({
    images,
    initialIdx,
    title,
    isDark,
    onClose,
}: LightboxModalProps) {
    const count = images.length;
    const [state, dispatch] = useReducer(lightboxReducer, initialIdx, createInitialLightboxState);
    const {
        activeIdx,
        scale,
        position,
        isInteracting,
        stripOffset,
        isStripAnimating,
        dismissY,
        dismissProgress,
    } = state;

    const { trigger } = useMobileHaptics();
    const modalRef      = useRef<HTMLDivElement | null>(null);
    const viewportRef   = useRef<HTMLDivElement | null>(null);
    const imgWrapperRef = useRef<HTMLDivElement | null>(null);

    const scaleRef                  = useRef(1);
    const positionRef               = useRef({ x: 0, y: 0 });
    const activeIdxRef              = useRef(initialIdx);
    const stripOffsetRef            = useRef(0);
    const isStripAnimatingRef       = useRef(false);
    const isDragMovedRef            = useRef(false);
    const lastTapRef                = useRef<number>(0);
    const lastTapPosRef             = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const lastTouchDoubleTapTimeRef = useRef<number>(0);
    const navTimerRef               = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => { scaleRef.current = scale; }, [scale]);
    useEffect(() => { positionRef.current = position; }, [position]);
    useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);

    const getImageSrc = useCallback((item: GalleryItem) => {
        if (typeof item === "string") return item;
        return isDark ? item.dark : item.light;
    }, [isDark]);

    const clampPosition = useCallback((targetScale: number, pos: { x: number; y: number }) => {
        if (!viewportRef.current || targetScale <= 1) return { x: 0, y: 0 };
        const vw = viewportRef.current.clientWidth;
        const vh = viewportRef.current.clientHeight;
        const maxPanX = Math.max(0, (vw * targetScale - vw) / 2);
        const maxPanY = Math.max(0, (vh * targetScale - vh) / 2);
        return {
            x: Math.max(-maxPanX, Math.min(maxPanX, pos.x)),
            y: Math.max(-maxPanY, Math.min(maxPanY, pos.y)),
        };
    }, []);

    const resetZoom = useCallback(() => {
        scaleRef.current = 1;
        positionRef.current = { x: 0, y: 0 };
        dispatch({ type: "RESET_ZOOM" });
    }, []);

    const handleZoomIn = useCallback(() => {
        const next = Math.min(MAX_SCALE, Math.round((scaleRef.current + SCALE_STEP) * 10) / 10);
        scaleRef.current = next;
        dispatch({ type: "SET_SCALE", scale: next });
        trigger("light");
    }, [trigger]);

    const handleZoomOut = useCallback(() => {
        const next = Math.max(MIN_SCALE, Math.round((scaleRef.current - SCALE_STEP) * 10) / 10);
        scaleRef.current = next;
        if (next <= 1) {
            positionRef.current = { x: 0, y: 0 };
            dispatch({ type: "SET_ZOOM", scale: next, position: { x: 0, y: 0 } });
        } else {
            const clamped = clampPosition(next, positionRef.current);
            positionRef.current = clamped;
            dispatch({ type: "SET_ZOOM", scale: next, position: clamped });
        }
        trigger("light");
    }, [trigger, clampPosition]);

    const navigateTo = useCallback((newIdx: number, direction: "prev" | "next") => {
        if (isStripAnimatingRef.current || count <= 1) return;
        const vw = viewportRef.current?.clientWidth ?? window.innerWidth;
        const targetOffset = direction === "prev" ? vw : -vw;

        isStripAnimatingRef.current = true;
        stripOffsetRef.current = targetOffset;
        dispatch({ type: "NAVIGATE_START", stripOffset: targetOffset });
        trigger("selection");

        if (navTimerRef.current) clearTimeout(navTimerRef.current);
        navTimerRef.current = setTimeout(() => {
            isStripAnimatingRef.current = false;
            stripOffsetRef.current = 0;
            activeIdxRef.current = newIdx;
            scaleRef.current = 1;
            positionRef.current = { x: 0, y: 0 };
            dispatch({ type: "NAVIGATE_END", newIdx });
        }, STRIP_ANIM_MS);
    }, [count, trigger]);

    const actionsRef = useRef({
        handleClose: onClose,
        handleZoomIn,
        handleZoomOut,
        resetZoom,
        clampPosition,
        trigger,
        navigateTo,
        count,
    });

    useEffect(() => {
        actionsRef.current = {
            handleClose: onClose,
            handleZoomIn,
            handleZoomOut,
            resetZoom,
            clampPosition,
            trigger,
            navigateTo,
            count,
        };
    }, [onClose, handleZoomIn, handleZoomOut, resetZoom, clampPosition, trigger, navigateTo, count]);

    useLightboxGestures({
        modalRef,
        viewportRef,
        imgWrapperRef,
        scaleRef,
        positionRef,
        activeIdxRef,
        stripOffsetRef,
        isStripAnimatingRef,
        isDragMovedRef,
        lastTapRef,
        lastTapPosRef,
        lastTouchDoubleTapTimeRef,
        actionsRef,
        dispatch,
    });

    useEffect(() => {
        return () => {
            if (navTimerRef.current) clearTimeout(navTimerRef.current);
        };
    }, []);

    const handleImageDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (Date.now() - lastTouchDoubleTapTimeRef.current < 700) {
            return;
        }
        const vp = viewportRef.current;
        if (!vp) return;
        const rect = vp.getBoundingClientRect();
        const tapX = e.clientX - rect.left - rect.width  / 2;
        const tapY = e.clientY - rect.top  - rect.height / 2;
        if (scaleRef.current > 1) {
            resetZoom();
            trigger("selection");
        } else {
            const targetScale = 2.4;
            const targetPos   = clampPosition(targetScale, {
                x: -tapX * (targetScale - 1),
                y: -tapY * (targetScale - 1),
            });
            scaleRef.current    = targetScale;
            positionRef.current = targetPos;
            dispatch({ type: "SET_ZOOM", scale: targetScale, position: targetPos });
            trigger("selection");
        }
    }, [clampPosition, resetZoom, trigger]);

    const prevIdx   = (activeIdx - 1 + count) % count;
    const nextIdx   = (activeIdx + 1) % count;
    const bgOpacity = Math.max(0.2, 0.95 - dismissProgress * 0.7);

    return (
        <m.div
            ref={modalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
                backgroundColor: `rgba(0,0,0,${bgOpacity})`,
                transition: isInteracting ? "none" : "background-color 0.25s ease-out",
            }}
            className="fixed inset-0 z-[999] backdrop-blur-md select-none overflow-hidden touch-none"
            role="dialog"
            aria-modal="true"
            aria-label="Fullscreen screenshot view"
        >
            <LightboxControls
                scale={scale}
                imagesCount={count}
                selectedIdx={activeIdx}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetZoom={resetZoom}
                onClose={onClose}
                onPrev={() => { if (!isStripAnimatingRef.current) navigateTo(prevIdx, "prev"); }}
                onNext={() => { if (!isStripAnimatingRef.current) navigateTo(nextIdx, "next"); }}
            />
            <LightboxStrip
                viewportRef={viewportRef}
                imgWrapperRef={imgWrapperRef}
                scale={scale}
                position={position}
                isInteracting={isInteracting}
                dismissY={dismissY}
                dismissProgress={dismissProgress}
                stripOffset={stripOffset}
                isStripAnimating={isStripAnimating}
                images={images}
                activeIdx={activeIdx}
                prevIdx={prevIdx}
                nextIdx={nextIdx}
                count={count}
                title={title}
                getImageSrc={getImageSrc}
                onImageDoubleClick={handleImageDoubleClick}
            />
        </m.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// VerticalGallery — thumbnail grid + lightbox portal
// ─────────────────────────────────────────────────────────────────────────────
export function VerticalGallery({
    images,
    title,
    className,
}: VerticalGalleryProps) {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const { resolvedTheme } = useTheme();
    const { trigger }       = useMobileHaptics();

    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
    const isDark  = mounted && resolvedTheme === "dark";

    const getImageUrl = useCallback(
        (item: GalleryItem) => {
            if (typeof item === "string") return item;
            return isDark ? item.dark : item.light;
        },
        [isDark]
    );

    const handleOpen = useCallback(
        (idx: number) => {
            setSelectedIdx(idx);
            trigger("selection");
        },
        [trigger]
    );

    const handleClose = useCallback(() => {
        setSelectedIdx(null);
        trigger("selection");
    }, [trigger]);

    if (!images || images.length === 0) return null;

    return (
        <>
            <div className={cn("w-full h-full xl:overflow-y-auto xl:px-8 xl:py-6 space-y-6 md:space-y-8", className)}>
                {images.map((item, idx) => {
                    const src     = getImageUrl(item);
                    const itemKey = getGalleryItemKey(item, idx);
                    return (
                        <m.button
                            type="button"
                            key={itemKey}
                            onClick={() => handleOpen(idx)}
                            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative w-full text-left rounded-2xl overflow-hidden border border-border/40 bg-zinc-900/5 dark:bg-zinc-900/40 transition-shadow duration-300 hover:shadow-xl dark:hover:shadow-2xl cursor-zoom-in cursor-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary block"
                            aria-label={`Open ${title} screenshot ${idx + 1} in full screen`}
                        >
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
                                    loading={idx <= 1 ? "eager" : "lazy"}
                                    priority={idx <= 1}
                                />
                            </div>
                        </m.button>
                    );
                })}
            </div>

            {mounted &&
                createPortal(
                    <AnimatePresence mode="wait">
                        {selectedIdx !== null && (
                            <LightboxModal
                                images={images}
                                initialIdx={selectedIdx}
                                title={title}
                                isDark={isDark}
                                onClose={handleClose}
                            />
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </>
    );
}
