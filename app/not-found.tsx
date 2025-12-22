import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <FadeIn>
                <h1 className="text-9xl font-bold tracking-tighter text-primary/20">
                    404
                </h1>
                <h2 className="mt-8 text-3xl font-bold tracking-tight">
                    Page Not Found
                </h2>
                <p className="mt-4 text-muted-foreground max-w-[500px]">
                    Sorry, we couldn&apos;t find the page you&apos;re looking
                    for. It might have been moved or doesn&apos;t exist.
                </p>
                <div className="mt-8">
                    <Link href="/">
                        <Button size="lg" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Return Home
                        </Button>
                    </Link>
                </div>
            </FadeIn>
        </div>
    );
}
