"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RotatingTitleProps {
    titles: string[];
    interval?: number;
}

export function RotatingTitle({ titles, interval = 3000 }: RotatingTitleProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % titles.length);
        }, interval);

        return () => clearInterval(timer);
    }, [titles, interval]);

    return (
        <div className="h-10 sm:h-10 md:h-12 flex items-center justify-center [perspective:1000px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={titles[index]}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                        hidden: { transition: { staggerChildren: 0.03 } },
                        visible: { transition: { staggerChildren: 0.03 } },
                        exit: {
                            transition: {
                                staggerChildren: 0.03,
                                staggerDirection: -1,
                            },
                        },
                    }}
                    className="flex items-center justify-center"
                >
                    {titles[index].split("").map((char, i) => (
                        <motion.span
                            key={i}
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    rotateX: -90,
                                    filter: "blur(10px)",
                                    y: -20,
                                },
                                visible: {
                                    opacity: 1,
                                    rotateX: 0,
                                    filter: "blur(0px)",
                                    y: 0,
                                    transition: {
                                        duration: 0.4,
                                        ease: "easeOut",
                                    },
                                },
                                exit: {
                                    opacity: 0,
                                    rotateX: 90,
                                    filter: "blur(10px)",
                                    y: 20,
                                    transition: {
                                        duration: 0.4,
                                        ease: "easeIn",
                                    },
                                },
                            }}
                            className="inline-block"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
