"use client";

import { useEffect, useRef } from "react";

const DRAG_THRESHOLD = 5;
const SMOOTH_TAU = 0.25;
const GLIDE_TAU = 0.8;
const MAX_FLING = 3000;

interface UseDraggableMarqueeOptions {
  draggable?: boolean;
  className?: string;
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  paused?: boolean;
  vertical?: boolean;
}

export function useDraggableMarquee({
  draggable = false,
  className,
  speed: speedProp,
  reverse = false,
  pauseOnHover = false,
  paused = false,
  vertical = false,
}: UseDraggableMarqueeOptions) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!draggable) return;

    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    let rafId = 0;

    const durationMatch =
      typeof className === "string"
        ? className.match(/--duration:\s*(\d+(?:\.\d+)?)s/i)
        : null;
    const parsedDuration = durationMatch ? parseFloat(durationMatch[1]) : 40;

    let offset = 0;
    let velocity = 0;
    let period = 0;
    let isHovered = false;
    let isFocused = false;
    let isGliding = false;
    let isDragging = false;
    let suppressUntil = 0;
    let lastTime = 0;
    let isVisible = true;
    let isReducedMotion = false;

    let dragId = -1;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartOffset = 0;
    let dragActive = false;
    let dragSamples: [number, number][] = [];

    const measure = () => {
      const lists = track.children;
      if (lists.length < 2) {
        if (lists.length === 1) {
          const r = lists[0].getBoundingClientRect();
          period = vertical ? r.height : r.width;
        }
        return;
      }
      const r0 = lists[0].getBoundingClientRect();
      const r1 = lists[1].getBoundingClientRect();
      const p = vertical ? r1.top - r0.top : r1.left - r0.left;
      if (p > 0) {
        period = p;
      }
    };

    measure();

    const frame = (now: number) => {
      if (!lastTime) lastTime = now;
      const dt = Math.min(0.1, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const P = period;
      const isPaused =
        paused || isFocused || (pauseOnHover && isHovered && !isDragging);
      const baseSpeed =
        speedProp ?? (parsedDuration && P > 0 ? P / parsedDuration : 45);
      const target =
        isPaused || isReducedMotion ? 0 : baseSpeed * (reverse ? -1 : 1);

      let busy = false;

      if (dragActive) {
        busy = true;
      } else {
        const tau = isGliding ? GLIDE_TAU : SMOOTH_TAU;
        velocity += (target - velocity) * (1 - Math.exp(-dt / tau));
        if (isGliding && Math.abs(velocity - target) < 3) {
          isGliding = false;
        }
        if (Math.abs(velocity - target) < 0.01) {
          velocity = target;
        }
        offset += velocity * dt;
        if (Math.abs(velocity) > 0.1 || target !== 0) {
          busy = true;
        }
      }

      if (P > 0) {
        offset = ((offset % P) + P) % P;
      }

      const px = -offset;
      track.style.transform = vertical
        ? `translate3d(0, ${px}px, 0)`
        : `translate3d(${px}px, 0, 0)`;

      if (busy && isVisible) {
        track.style.setProperty("will-change", "transform");
        rafId = requestAnimationFrame(frame);
      } else {
        track.style.setProperty("will-change", "auto");
      }
    };

    const wake = () => {
      if (!isVisible) return;
      if (rafId) cancelAnimationFrame(rafId);
      lastTime = 0;
      rafId = requestAnimationFrame(frame);
    };

    const onPointerEnter = () => {
      isHovered = true;
      wake();
    };

    const onPointerLeave = () => {
      isHovered = false;
      wake();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      dragId = e.pointerId;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartOffset = offset;
      dragActive = false;
      dragSamples = [[performance.now(), vertical ? e.clientY : e.clientX]];
      wake();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragId !== e.pointerId) return;

      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      const along = vertical ? dy : dx;
      const across = vertical ? dx : dy;

      if (!dragActive) {
        if (Math.abs(along) < DRAG_THRESHOLD) return;
        if (Math.abs(across) > Math.abs(along)) {
          dragId = -1;
          return;
        }
        dragActive = true;
        isDragging = true;
        isGliding = false;
        velocity = 0;
        try {
          root.setPointerCapture(e.pointerId);
        } catch {}
        root.setAttribute("data-dragging", "");
      }

      const next = dragStartOffset - along;
      const P = period;
      if (P > 0) {
        offset = ((next % P) + P) % P;
        dragStartOffset += offset - next;
      } else {
        offset = next;
      }

      const now = performance.now();
      const pos = vertical ? e.clientY : e.clientX;
      dragSamples.push([now, pos]);
      while (dragSamples.length > 2 && now - dragSamples[0][0] > 100) {
        dragSamples.shift();
      }

      wake();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (dragId !== e.pointerId) return;

      if (dragActive) {
        root.removeAttribute("data-dragging");
        try {
          root.releasePointerCapture(e.pointerId);
        } catch {}
        isDragging = false;
        suppressUntil = performance.now() + 350;

        const now = performance.now();
        const sm = dragSamples;
        if (sm.length >= 2) {
          const [t0, p0] = sm[0];
          const [t1, p1] = sm[sm.length - 1];
          const dt = t1 - t0;
          if (dt > 10 && now - t1 < 80) {
            const v = -((p1 - p0) / dt) * 1000;
            velocity = Math.min(MAX_FLING, Math.max(-MAX_FLING, v));
            isGliding = Math.abs(velocity) > 30;
          }
        }
      }

      dragId = -1;
      dragActive = false;
      wake();
    };

    const onClick = (e: MouseEvent) => {
      if (performance.now() < suppressUntil) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onWheel = (e: WheelEvent) => {
      const along = vertical ? e.deltaY : e.shiftKey ? e.deltaY : e.deltaX;
      const across = vertical ? e.deltaX : e.shiftKey ? e.deltaX : e.deltaY;
      if (Math.abs(along) > Math.abs(across) || (!vertical && e.shiftKey)) {
        e.preventDefault();
        const P = period;
        offset += along;
        if (P > 0) {
          offset = ((offset % P) + P) % P;
        }
        velocity = Math.min(1500, Math.max(-1500, along * 15));
        isGliding = true;
        wake();
      }
    };

    const onFocusIn = () => {
      isFocused = true;
      wake();
    };

    const onFocusOut = (e: FocusEvent) => {
      if (root.contains(e.relatedTarget as Node | null)) return;
      isFocused = false;
      wake();
    };

    const onDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReducedMotion = motionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      wake();
    };
    motionQuery.addEventListener("change", onMotionChange);

    const onVisibility = () => {
      if (!document.hidden && isVisible) {
        wake();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        measure();
        wake();
      });
      resizeObserver.observe(root);
      if (track.children[0]) {
        resizeObserver.observe(track.children[0]);
      }
    }

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            wake();
          }
        },
        { rootMargin: "150px" },
      );
      intersectionObserver.observe(root);
    }

    root.addEventListener("pointerenter", onPointerEnter);
    root.addEventListener("pointerleave", onPointerLeave);
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);
    root.addEventListener("lostpointercapture", onPointerUp);
    root.addEventListener("click", onClick, true);
    root.addEventListener("dragstart", onDragStart);
    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);

    wake();

    return () => {
      cancelAnimationFrame(rafId);
      root.removeEventListener("pointerenter", onPointerEnter);
      root.removeEventListener("pointerleave", onPointerLeave);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
      root.removeEventListener("lostpointercapture", onPointerUp);
      root.removeEventListener("click", onClick, true);
      root.removeEventListener("dragstart", onDragStart);
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
    };
  }, [
    draggable,
    className,
    speedProp,
    reverse,
    pauseOnHover,
    paused,
    vertical,
  ]);

  return { rootRef, trackRef };
}
