"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

interface ContactCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    href: string;
    className?: string;
}

export function ContactCard({
    icon,
    label,
    value,
    href,
    className,
}: ContactCardProps) {
    const [hasCopied, setHasCopied] = useState(false);

    const onCopy = async () => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
            } else {
                throw new Error("Clipboard API not available");
            }
        } catch {
            // Fallback for non-secure contexts (http)
            const textArea = document.createElement("textarea");
            textArea.value = value;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand("copy");
            } catch (e) {
                console.error("Copy failed", e);
            }
            textArea.remove();
        }

        setHasCopied(true);
        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    };

    return (
        <div
            className={cn(
                "group relative rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground",
                className
            )}
        >
            <a
                href={href}
                onClick={onCopy}
                className="flex items-center gap-4 p-4 pr-14 w-full cursor-copy"
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground truncate">
                        {value}
                    </p>
                </div>
            </a>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onCopy();
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-md hover:bg-background/50 text-muted-foreground transition-colors z-10 touch-manipulation"
                            aria-label="Copy to clipboard"
                        >
                            {hasCopied ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Copy to clipboard</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
