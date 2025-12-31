"use client";

import { useState, useEffect } from "react";
import { projects as projectsData } from "@/data/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { useNavigation } from "@/components/providers/navigation-provider";

export default function ProjectsPage() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [hasHover, setHasHover] = useState(false);
    const { previousPath } = useNavigation();
    const [isRestoring, setIsRestoring] = useState(
        previousPath?.startsWith("/projects/") && previousPath !== "/projects"
    );

    useEffect(() => {
        setHasHover(window.matchMedia("(pointer: fine)").matches);

        // Handle scrolling back to the previous project
        if (isRestoring) {
            const slug = previousPath?.split(/[?#]/)[0].split("/").pop();
            if (slug) {
                // Use 0ms to run immediately after mount/paint but allow DOM to be ready
                const timer = setTimeout(() => {
                    const element = document.getElementById(slug);
                    if (element) {
                        element.scrollIntoView({
                            behavior: "instant",
                            block: "center",
                        });
                    }
                    setIsRestoring(false);
                }, 0);
                return () => clearTimeout(timer);
            } else {
                setIsRestoring(false);
            }
        }
    }, [previousPath, isRestoring]);

    const handleHover = (index: number) => {
        if (hasHover) {
            setHoveredIndex(index);
        }
    };

    return (
        <div
            className={`container mx-auto py-12 px-4 space-y-8 pb-24 md:pb-12 transition-opacity duration-300 ${
                isRestoring ? "opacity-0" : "opacity-100"
            }`}
        >
            <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
                <p className="text-xl text-muted-foreground">
                    Here are some of the projects I&apos;ve worked on.
                </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projectsData.map((project, index) => (
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
        </div>
    );
}
