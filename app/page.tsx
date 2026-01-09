import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Mouse } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { Metadata } from "next";
import { profile } from "@/data/profile";
import { siteConfig } from "@/data/config";

import { FeaturedProjects } from "@/components/home/featured-projects";
import { Badge } from "@/components/ui/badge";
import { skills } from "@/data/skills";
import { experience } from "@/data/experience";

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

                {/* Skills Section */}
                <section className="container mx-auto px-4 py-12 md:py-24 lg:py-32 bg-muted/30 rounded-3xl my-12">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                            Skills & Expertise
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            technologies I work with
                        </p>
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-center">
                                Languages
                            </h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                {skills.languages.map((skill) => (
                                    <Badge
                                        key={skill.name}
                                        variant="secondary"
                                        className="px-3 py-1 text-sm bg-background border-border/40"
                                    >
                                        {skill.icon && (
                                            <skill.icon className="w-4 h-4 mr-2" />
                                        )}
                                        {skill.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-center">
                                Mobile Development
                            </h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                {skills.mobile.map((skill) => (
                                    <Badge
                                        key={skill.name}
                                        variant="secondary"
                                        className="px-3 py-1 text-sm bg-background border-border/40"
                                    >
                                        {skill.icon && (
                                            <skill.icon className="w-4 h-4 mr-2" />
                                        )}
                                        {skill.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-center">
                                Web & Backend
                            </h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                {[...skills.web, ...skills.backend].map(
                                    (skill) => (
                                        <Badge
                                            key={skill.name}
                                            variant="secondary"
                                            className="px-3 py-1 text-sm bg-background border-border/40"
                                        >
                                            {skill.icon && (
                                                <skill.icon className="w-4 h-4 mr-2" />
                                            )}
                                            {skill.name}
                                        </Badge>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Experience */}
                {experience.length > 0 && (
                    <section className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                Recent Experience
                            </h2>
                        </div>
                        <div className="max-w-3xl mx-auto space-y-8">
                            {experience.slice(0, 2).map((item, index) => (
                                <div
                                    key={index}
                                    className="relative pl-8 border-l border-border/50 pb-8 last:pb-0"
                                >
                                    <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-primary" />
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                                        <h3 className="text-xl font-bold">
                                            {item.role}
                                        </h3>
                                        <span className="text-muted-foreground text-sm font-medium">
                                            {item.dates}
                                        </span>
                                    </div>
                                    <div className="text-lg font-semibold text-primary mb-4">
                                        {item.company}
                                    </div>
                                    <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                                        {item.description.map((desc, i) => (
                                            <li key={i}>{desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </FadeIn>
        </div>
    );
}
