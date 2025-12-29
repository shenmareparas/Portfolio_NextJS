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
            whileHover={{ y: -8 }}
            className="h-full group"
        >
            <Card
                className="relative flex h-full flex-col overflow-hidden border-border/40 transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl"
                style={
                    {
                        "--project-accent": accentLight,
                        "--project-accent-dark": accentDark,
                    } as React.CSSProperties
                }
            >
                {/* Dynamic Border Glow */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none z-20">
                    <div className="absolute inset-0 border-2 border-[var(--project-accent)] dark:border-[var(--project-accent-dark)] rounded-xl opacity-50" />
                    <div className="absolute inset-0 bg-[var(--project-accent)] dark:bg-[var(--project-accent-dark)] opacity-[0.03]" />
                </div>

                <Link
                    href={`/projects/${project.slug}`}
                    className="absolute inset-0 z-10 focus:outline-none"
                >
                    <span className="sr-only">View {project.title}</span>
                </Link>

                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Image Overlay which lightens on hover */}
                    <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-transparent" />
                </div>

                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                        <span className="truncate text-lg group-hover:text-[var(--project-accent)] dark:group-hover:text-[var(--project-accent-dark)] transition-colors duration-300">
                            {project.title}
                        </span>
                        <ArrowUpRight className="h-5 w-5 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-[var(--project-accent)] dark:text-[var(--project-accent-dark)]" />
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-muted-foreground/80">
                        {project.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex items-end pb-6">
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="accented"
                                shape="pill"
                                className="transition-colors duration-300"
                                style={
                                    project.accentColor
                                        ? ({
                                              "--accent-light": accentLight,
                                              "--accent-dark": accentDark,
                                              "--accent-light-bg": `${accentLight}15`,
                                              "--accent-dark-bg": `${accentDark}20`,
                                          } as React.CSSProperties)
                                        : undefined
                                }
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
