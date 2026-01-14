"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Testimonial } from "@/types/testimonial";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Marquee } from "@/components/ui/marquee";
import { Star } from "lucide-react";

const StarRating = ({
    stars = 5,
    className,
}: {
    stars?: number;
    className?: string;
}) => {
    return (
        <div className={`flex gap-0.5 ${className}`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                        i < stars
                            ? "fill-foreground text-foreground"
                            : "fill-muted text-muted-foreground/20"
                    }`}
                />
            ))}
        </div>
    );
};

interface TestimonialsProps {
    testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
    const [randomizedTestimonials, setRandomizedTestimonials] =
        useState<Testimonial[]>(testimonials);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (testimonials.length > 1) {
            const shuffled = [...testimonials];
            // Fisher-Yates shuffle
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            // Ensure first and last items are different to avoid repetition in loop
            // Compare by content or some unique identifier (assuming name is unique enough here)
            if (shuffled[0].name === shuffled[shuffled.length - 1].name) {
                // If they are the same, swap the first item with the middle item
                const mid = Math.floor(shuffled.length / 2);
                [shuffled[0], shuffled[mid]] = [shuffled[mid], shuffled[0]];
            }
            setRandomizedTestimonials(shuffled);
        }
    }, [testimonials]);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex(
                (prev) => (prev + 1) % randomizedTestimonials.length
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [randomizedTestimonials.length, isPaused]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
        }),
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const handleDragEnd = (
        _e: MouseEvent | TouchEvent | PointerEvent,
        { offset, velocity }: { offset: { x: number }; velocity: { x: number } }
    ) => {
        const swipe = swipePower(offset.x, velocity.x);

        if (swipe < -swipeConfidenceThreshold) {
            setDirection(1);
            setCurrentIndex(
                (prev) => (prev + 1) % randomizedTestimonials.length
            );
        } else if (swipe > swipeConfidenceThreshold) {
            setDirection(-1);
            setCurrentIndex(
                (prev) =>
                    (prev - 1 + randomizedTestimonials.length) %
                    randomizedTestimonials.length
            );
        }
    };

    if (randomizedTestimonials.length === 0) return null;

    const testimonial = randomizedTestimonials[currentIndex];

    return (
        <section className="py-12 md:py-24 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4 text-center mb-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Testimonials
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    What others say about working with me
                </p>
            </div>

            {/* Mobile View - AnimatePresence Carousel */}
            <div
                className="md:hidden container mx-auto px-4 relative flex w-full flex-col items-center justify-center min-h-[400px] overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                <div className="relative w-full h-[300px] flex items-center justify-center">
                    <AnimatePresence
                        initial={false}
                        custom={direction}
                        mode="popLayout"
                    >
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                },
                                opacity: { duration: 0.2 },
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={handleDragEnd}
                            className="absolute w-full h-full cursor-grab active:cursor-grabbing px-2"
                        >
                            <Card className="w-full h-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-zinc-200 dark:border-white/10">
                                                <AvatarImage
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                />
                                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-medium">
                                                    {testimonial.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold text-sm leading-none mb-1.5">
                                                    {testimonial.name}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                                                    <span>
                                                        {testimonial.project}
                                                    </span>
                                                    {testimonial.platform && (
                                                        <>
                                                            <span className="text-border">
                                                                •
                                                            </span>
                                                            <span className="text-foreground/60">
                                                                {
                                                                    testimonial.platform
                                                                }
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <StarRating
                                                stars={testimonial.stars}
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-[15px] text-foreground/90 leading-relaxed font-normal">
                                        {testimonial.content}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Indicators */}
                <div className="flex gap-2 mt-8 z-10">
                    {randomizedTestimonials.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? "bg-foreground w-4"
                                    : "bg-foreground/20"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Desktop View - Marquee */}
            <div className="hidden md:flex relative w-full flex-col items-center justify-center overflow-hidden">
                <Marquee pauseOnHover className="[--duration:40s] py-12">
                    {randomizedTestimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="w-[450px] flex-none border border-zinc-200/50 dark:border-white/5 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-md transition-all duration-300 hover:border-zinc-300/50 dark:hover:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/60 mx-6 shadow-xl"
                        >
                            <CardHeader className="pb-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-11 w-11 border border-zinc-200 dark:border-white/10">
                                            <AvatarImage
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                            />
                                            <AvatarFallback className="bg-primary/5 text-primary text-sm font-medium">
                                                {testimonial.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-base leading-none mb-1.5">
                                                {testimonial.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                <span>
                                                    {testimonial.project}
                                                </span>
                                                {testimonial.platform && (
                                                    <>
                                                        <span className="text-border">
                                                            •
                                                        </span>
                                                        <span className="text-foreground/60">
                                                            {
                                                                testimonial.platform
                                                            }
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <StarRating stars={testimonial.stars} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 pb-6">
                                <p className="text-[15px] text-foreground/80 leading-7 font-normal tracking-wide">
                                    {testimonial.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </Marquee>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background dark:from-background"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background dark:from-background"></div>
            </div>
        </section>
    );
}
