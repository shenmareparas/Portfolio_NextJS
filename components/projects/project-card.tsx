"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useNavigation } from "@/components/providers/navigation-provider";
import { Github, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Project } from "@/types/project";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
    const { previousPath } = useNavigation();
    const shouldAnimate = !(
        previousPath?.startsWith("/projects/") && previousPath !== "/projects"
    );

    const accentLight =
        typeof project.accentColor === "object"
            ? project.accentColor.light
            : project.accentColor;
    const accentDark =
        typeof project.accentColor === "object"
            ? project.accentColor.dark
            : project.accentColor;

    return (
        <motion.div
            initial={
                shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <Card className="group relative flex h-full flex-col overflow-hidden border-primary/40 transition-colors hover:border-border hover:shadow-lg">
                <Link
                    href={`/projects/${project.slug}`}
                    className="absolute inset-0 z-10"
                >
                    <span className="sr-only">View {project.title}</span>
                </Link>
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="truncate">{project.title}</span>
                        <ArrowUpRight className="h-4 w-4 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                        {project.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className={`font-normal transition-colors ${
                                    project.accentColor
                                        ? "bg-[var(--accent-light-bg)] dark:bg-[var(--accent-dark-bg)] hover:bg-[var(--accent-light-bg)] dark:hover:bg-[var(--accent-dark-bg)]"
                                        : ""
                                }`}
                                style={
                                    project.accentColor
                                        ? ({
                                              "--accent-light": accentLight,
                                              "--accent-dark": accentDark,
                                              "--accent-light-bg": `${accentLight}15`,
                                              "--accent-dark-bg": `${accentDark}15`,
                                          } as React.CSSProperties)
                                        : undefined
                                }
                            >
                                <span
                                    className={
                                        project.accentColor
                                            ? "text-[var(--accent-light)] dark:text-[var(--accent-dark)]"
                                            : ""
                                    }
                                >
                                    {tag}
                                </span>
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
