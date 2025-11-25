"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import experienceData from "@/data/experience.json";

export function ExperienceTimeline() {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Vertical Line */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border -ml-[0.5px] hidden md:block" />

      <div className="space-y-12">
        {experienceData.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex flex-col md:flex-row gap-8 ${
              index % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Timeline Dot */}
            <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 rounded-full bg-primary -ml-[8px] hidden md:block" />

            {/* Content */}
            <div className="flex-1 md:w-1/2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-xl">{job.role}</CardTitle>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {job.company}
                      </span>
                      <span>{job.dates}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                    {job.description.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {job.tech.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Spacer for the other side */}
            <div className="hidden md:block md:w-1/2" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
