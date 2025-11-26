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
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Project {
    id: string;
    slug: string;
    title: string;
    description: string;
    tags: string[];
    link?: string;
    image: string;
    accentColor?: string;
}

interface ProjectCardProps {
    project: Project;
    index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
    const { previousPath } = useNavigation();
    const shouldAnimate = !(
        previousPath?.startsWith("/projects/") && previousPath !== "/projects"
    );

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
            <Card className="group relative flex h-full flex-col overflow-hidden border-muted/40 transition-colors hover:border-primary/40 hover:shadow-lg">
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
                    {project.link && (
                        <div className="absolute right-2 top-2 z-20">
                            <Button
                                asChild
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background hover:text-primary"
                            >
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Github className="h-4 w-4" />
                                    <span className="sr-only">GitHub</span>
                                </a>
                            </Button>
                        </div>
                    )}
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
                                className="font-normal transition-colors"
                                style={
                                    project.accentColor
                                        ? {
                                              backgroundColor: `${project.accentColor}15`,
                                              color: project.accentColor,
                                          }
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
