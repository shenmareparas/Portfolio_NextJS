import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        absolute: "Paras Shenmare",
    },
    description:
        "Paras - Mobile Developer Portfolio. specialized in android and iOS development.",
};

export default function Home() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
            <FadeIn>
                <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
                    <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            Hi, I&apos;m{" "}
                            <span className="text-primary">Paras</span>
                        </h1>
                        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl text-muted-foreground">
                            Mobile Developer
                        </h2>
                        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                            I build accessible, pixel-perfect, and performant
                            mobile applications for iOS and Android. Passionate
                            about Flutter, Kotlin and Swift.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Link href="/projects">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto gap-2"
                                >
                                    View Projects{" "}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <a
                                href="/ParasShenmare_Resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto gap-2"
                                >
                                    View My CV <FileText className="h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>
            </FadeIn>
        </div>
    );
}
