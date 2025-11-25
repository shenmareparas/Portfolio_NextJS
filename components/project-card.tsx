"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, ArrowRight } from "lucide-react";
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
}

interface ProjectCardProps {
    project: Project;
    index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <Card className="flex h-full flex-col overflow-hidden border-muted/40 transition-colors hover:border-primary/40 hover:shadow-lg">
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
                    <CardTitle className="line-clamp-1">
                        {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                        {project.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="font-normal"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="gap-2">
                    <Button asChild className="flex-1 gap-2" variant="outline">
                        <Link href={`/projects/${project.slug}`}>
                            View Details <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                    {project.link && (
                        <Button
                            asChild
                            className="gap-2"
                            variant="ghost"
                            size="icon"
                        >
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </a>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}
