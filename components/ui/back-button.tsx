"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

export function BackButton({ children, className, ...props }: BackButtonProps) {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            className={cn(
                "pl-0 hover:bg-transparent hover:text-primary",
                className
            )}
            onClick={() => router.back()}
            {...props}
        >
            {children}
        </Button>
    );
}
