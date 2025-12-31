"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/components/providers/navigation-provider";

interface BackButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    href?: string;
}

export function BackButton({
    children,
    className,
    href,
    ...props
}: BackButtonProps) {
    const router = useRouter();
    const { previousPath } = useNavigation();

    const handleBack = (e: React.MouseEvent) => {
        if (href && previousPath === href) {
            e.preventDefault();
            router.back();
        }
    };

    if (href) {
        return (
            <Button
                asChild
                variant="ghost"
                className={cn(
                    "pl-0 hover:bg-transparent hover:text-primary",
                    className
                )}
                onClick={handleBack}
            >
                <Link href={href} scroll={false} {...(props as any)}>
                    {children}
                </Link>
            </Button>
        );
    }

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
