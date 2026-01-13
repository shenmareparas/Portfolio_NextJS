"use client";

import { useState, useEffect } from "react";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/project-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FeaturedProjects() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [hasHover, setHasHover] = useState(false);

    useEffect(() => {
        // Defer state update to avoid synchronous rendering warning
        setTimeout(() => {
            setHasHover(window.matchMedia("(pointer: fine)").matches);
        }, 0);
    }, []);

    const handleHover = (index: number) => {
        if (hasHover) {
            setHoveredIndex(index);
        }
    };

    return (
        <section className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Featured Projects
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Here&apos;s a curated selection showcasing my expertise
                </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 3).map((project, index) => (
                    <ProjectCard
                        key={project.slug}
                        project={project}
                        index={index}
                        isDimmed={
                            hoveredIndex !== null && hoveredIndex !== index
                        }
                        onHover={() => handleHover(index)}
                        onBlur={() => setHoveredIndex(null)}
                        disabled={!hasHover}
                    />
                ))}
            </div>
            <div className="flex justify-center mt-12">
                <Link href="/projects">
                    <Button variant="outline" size="lg" className="gap-2">
                        View All Projects <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </section>
    );
}
