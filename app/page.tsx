import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Mouse } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { Metadata } from "next";
import { profile } from "@/data/profile";
import { siteConfig } from "@/data/config";

import { FeaturedProjects } from "@/components/home/featured-projects";

import { Testimonials } from "@/components/home/testimonials";
import { testimonials } from "@/data/testimonials";

import { Expertise } from "@/components/home/expertise";

export const metadata: Metadata = {
    title: {
        absolute: profile.fullName,
    },
    description: siteConfig.description,
};

export default function Home() {
    return (
        <div className="flex flex-1 flex-col items-center">
            <FadeIn className="w-full">
                <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 min-h-[calc(100dvh-4rem)] flex flex-col justify-center relative">
                    <div className="container mx-auto px-4 flex max-w-[64rem] flex-col items-center gap-6 text-center">
                        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            Hi, I&apos;m{" "}
                            <span className="text-primary">{profile.name}</span>
                        </h1>
                        <h2 className="font-heading text-2xl sm:text-2xl md:text-3xl text-primary">
                            Software Developer
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

                    {/* Scroll Hint */}
                    <div className="absolute bottom-24 left-0 right-0 flex justify-center animate-bounce">
                        <Mouse className="h-8 w-8 text-muted-foreground opacity-50" />
                    </div>
                </section>

                {/* Featured Projects */}
                <FeaturedProjects />

                {/* Expertise Section */}
                <Expertise />

                {/* Testimonials Section */}
                <Testimonials testimonials={testimonials} />
            </FadeIn>
        </div>
    );
}
