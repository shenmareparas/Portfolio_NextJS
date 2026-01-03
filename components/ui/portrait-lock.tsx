"use client";

import { Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function PortraitLock() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsMounted(true), 0);
    }, []);

    if (!isMounted) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[9999] bg-background flex-col items-center justify-center gap-6 p-8 text-center hidden",
                // Show only on landscape orientation AND max-height 600px (typical phones)
                // We use raw CSS media query for precision targeting
                "[@media(max-height:600px)_and_(orientation:landscape)]:flex"
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
        </div>
    );
}
