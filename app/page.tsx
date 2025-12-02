import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { Metadata } from "next";
import { profile } from "@/data/profile";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = {
    title: {
        absolute: profile.fullName,
    },
    description: siteConfig.description,
};

export default function Home() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
            <FadeIn>
                <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
                    <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            Hi, I&apos;m{" "}
                            <span className="text-primary">{profile.name}</span>
                        </h1>
                        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl text-muted-foreground">
                            {profile.title}
                        </h2>
                        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                            {profile.description}
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
                                href={profile.resumeLink}
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
