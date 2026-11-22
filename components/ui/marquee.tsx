"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useDraggableMarquee } from "@/hooks/use-draggable-marquee";

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  paused?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  draggable?: boolean;
  speed?: number;
  [key: string]: unknown;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  paused = false,
  children,
  vertical = false,
  repeat = 4,
  draggable = false,
  speed,
  ...props
}: MarqueeProps) {
  const { rootRef, trackRef } = useDraggableMarquee({
    draggable,
    className,
    speed,
    reverse,
    pauseOnHover,
    paused,
    vertical,
  });

  if (draggable) {
    return (
      <div
        ref={rootRef}
        {...props}
        className={cn(
          "group flex w-full max-w-full overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]",
          "cursor-grab select-none [touch-action:pan-y] data-[dragging]:cursor-grabbing",
          "[&[data-dragging]_*]:cursor-grabbing [&[data-dragging]_*]:pointer-events-none",
          {
            "flex-row": !vertical,
            "flex-col": vertical,
          },
          className,
        )}
      >
        <div
          ref={trackRef}
          className={cn("flex shrink-0 [gap:var(--gap)]", {
            "w-max flex-row": !vertical,
            "h-max flex-col": vertical,
          })}
        >
          {Array(repeat)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                aria-hidden={i > 0 || undefined}
                inert={i > 0}
                className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
                  "flex-row": !vertical,
                  "flex-col": vertical,
                })}
              >
                {children}
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div
      {...props}
      className={cn(
        "group flex w-full max-w-full overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            aria-hidden={i > 0 || undefined}
            inert={i > 0}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-play-state:paused]": paused,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
