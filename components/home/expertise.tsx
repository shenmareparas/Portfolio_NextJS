"use client";

import { useState } from "react";
import { expertise } from "@/data/expertise";
import {
  ChevronDown,
  Smartphone,
  Code,
  Globe,
  Palette,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobileHaptics } from "@/hooks/use-mobile-haptics";

const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  code: Code,
  globe: Globe,
  palette: Palette,
};

export function Expertise() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const haptic = useMobileHaptics();

  const toggleItem = (id: string) => {
    haptic.trigger("selection");
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Area of Expertise
        </h2>
        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          My technical skills and professional focus areas.
        </p>
      </div>
      <div className="mx-auto max-w-3xl space-y-4">
        {expertise.map((item) => {
          const Icon = iconMap[item.icon];
          const isOpen = openItem === item.id;
          const panelId = `expertise-panel-${item.id}`;
          return (
            <div
              key={item.id}
              className="border border-zinc-200 dark:border-white/10 rounded-xl bg-card text-card-foreground shadow-sm overflow-hidden"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center justify-between p-6 text-left font-medium transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Icon
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <span className="text-lg md:text-xl font-semibold">
                    {item.title}
                  </span>
                </div>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              <div
                id={panelId}
                inert={!isOpen}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed pl-[4.5rem]">
                    {item.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
