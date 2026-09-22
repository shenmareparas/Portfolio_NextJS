"use client";

import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export function PortraitLock() {
    return (
        <aside
            aria-live="polite"
            className={cn(
                "fixed inset-0 z-[9999] bg-background flex-col items-center justify-center gap-6 p-8 text-center hidden",
                // Show ONLY on mobile touch devices in landscape orientation with max-height 600px
                // Using pointer:coarse and hover:none ensures desktop/laptop displays with small viewport heights (taskbar + browser bars) are never locked
                "[@media(hover:none)_and_(pointer:coarse)_and_(orientation:landscape)_and_(max-height:600px)_and_(max-width:1024px)]:flex"
            )}
        >
            <div className="relative">
                <Smartphone className="w-16 h-16 text-primary/80 animate-[spin_2s_ease-in-out_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">↻</span>
                </div>
            </div>
            <div className="space-y-2 max-w-sm">
                <h2 className="text-2xl font-bold tracking-tight">
                    Please Rotate Device
                </h2>
                <p className="text-muted-foreground">
                    This website is best experienced in portrait mode on your
                    mobile device.
                </p>
            </div>
        </aside>
    );
}

