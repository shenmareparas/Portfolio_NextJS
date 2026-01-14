"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const iconMap: Record<string, LucideIcon> = {
    smartphone: Smartphone,
    code: Code,
    globe: Globe,
    palette: Palette,
};

export function Expertise() {
    const [openItem, setOpenItem] = useState<string | null>(null);

    const toggleItem = (id: string) => {
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
                    return (
                        <div
                            key={item.id}
                            className="border border-zinc-200 dark:border-white/10 rounded-xl bg-card text-card-foreground shadow-sm overflow-hidden"
                        >
                            <button
                                onClick={() => toggleItem(item.id)}
                                className="flex w-full items-center justify-between p-6 text-left font-medium transition-all hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-3">
                                    {Icon && (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                    )}
                                    <span className="text-lg md:text-xl font-semibold">
                                        {item.title}
                                    </span>
                                </div>
                                <ChevronDown
                                    className={cn(
                                        "h-5 w-5 text-muted-foreground transition-transform duration-200",
                                        openItem === item.id && "rotate-180"
                                    )}
                                />
                            </button>
                            <AnimatePresence initial={false}>
                                {openItem === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed pl-[4.5rem]">
                                            {item.description}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
