"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Certification, Achievement } from "@/types/education";
import { CertificationCard } from "./certification-card";
import { AchievementCard } from "./achievement-card";
import { useMobileHaptics } from "@/hooks/use-mobile-haptics";
import { cn } from "@/lib/utils";

interface CredentialsSectionProps {
  certifications: Certification[];
  achievements: Achievement[];
}

const INITIAL_VISIBLE_COUNT = 6;

export function CredentialsSection({
  certifications,
  achievements,
}: CredentialsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const haptics = useMobileHaptics();

  const toggleExpand = () => {
    haptics.trigger("selection");
    setIsExpanded((prev) => !prev);
  };

  const initialCertifications = certifications.slice(0, INITIAL_VISIBLE_COUNT);
  const remainingCertifications = certifications.slice(INITIAL_VISIBLE_COUNT);
  const hasMore = remainingCertifications.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* Certifications Column */}
      <section aria-labelledby="certifications-heading" className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <h2
            id="certifications-heading"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Certifications
          </h2>
          <span className="text-xs font-mono font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-muted/60 border border-border/40">
            {certifications.length}
          </span>
        </div>

        <div className="space-y-2.5">
          {initialCertifications.map((cert) => (
            <CertificationCard key={cert.name} cert={cert} />
          ))}

          {/* Smooth Collapsible Drawer for Remaining Certifications */}
          {hasMore && (
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                isExpanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden space-y-2.5 pt-0">
                {remainingCertifications.map((cert) => (
                  <CertificationCard key={cert.name} cert={cert} />
                ))}
              </div>
            </div>
          )}

          {hasMore && (
            <button
              type="button"
              onClick={toggleExpand}
              aria-expanded={isExpanded}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border/60 hover:border-primary/40 bg-card/60 hover:bg-card hover:shadow-xs text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-[border-color,background-color,box-shadow,color] group mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>
                {isExpanded
                  ? "Show fewer certifications"
                  : "Show all certifications"}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200 text-muted-foreground group-hover:text-foreground",
                  isExpanded && "rotate-180",
                )}
              />
            </button>
          )}
        </div>
      </section>

      {/* Achievements Column */}
      <section aria-labelledby="achievements-heading" className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <h2
            id="achievements-heading"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Achievements
          </h2>
          <span className="text-xs font-mono font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-muted/60 border border-border/40">
            {achievements.length}
          </span>
        </div>

        <div className="space-y-2.5">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.title}
              achievement={achievement}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
