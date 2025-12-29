"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { experience as experienceData } from "@/data/experience";

export function ExperienceTimeline() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {experienceData.map((job, index) => (
                <div key={index}>
                    <Card className="border-none shadow-none bg-transparent">
                        <CardContent className="p-0">
                            <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12">
                                {/* Left Column: Header Info */}
                                <div className="space-y-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <h3 className="text-xl font-semibold text-foreground">
                                            {job.role}
                                        </h3>
                                        <p className="text-lg font-medium text-primary">
                                            {job.company}
                                        </p>
                                        <p className="text-sm text-muted-foreground font-mono">
                                            {job.dates}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {job.tech.map((tech) => (
                                            <Badge
                                                key={tech}
                                                variant="secondary"
                                                shape="pill"
                                                size="default"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Column: Details */}
                                <div className="space-y-4">
                                    <ul className="list-disc list-outside ml-4 space-y-3 text-muted-foreground">
                                        {job.description.map((point, i) => (
                                            <li
                                                key={i}
                                                className="leading-relaxed pl-1"
                                            >
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Divider between items, but not after the last one */}
                    {index < experienceData.length - 1 && (
                        <div className="h-px bg-border mt-8 md:mt-12" />
                    )}
                </div>
            ))}
        </div>
    );
}
