"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { Testimonial } from "@/types/testimonial";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Marquee } from "@/components/ui/marquee";
import { Quote } from "lucide-react";

interface TestimonialsProps {
    testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const x = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            const width =
                containerRef.current?.offsetWidth || window.innerWidth;
            animate(x, -width, {
                type: "spring",
                stiffness: 260,
                damping: 20,
                onComplete: () => {
                    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
                    x.set(0);
                },
            });
        }, 5000);

        return () => clearInterval(timer);
    }, [testimonials.length, isPaused, x]);

    // Calculate indices for the 3-card window
    const prevIndex =
        (currentIndex - 1 + testimonials.length) % testimonials.length;
    const nextIndex = (currentIndex + 1) % testimonials.length;

    // We map -1 (prev), 0 (current), 1 (next) relative positions
    const renderCard = (index: number, position: number) => {
        const testimonial = testimonials[index];
        return (
            <div
                className="absolute top-0 w-full h-full p-2"
                style={{
                    left: `${position * 100}%`,
                }}
            >
                <Card className="w-full border border-white/10 bg-white/5 backdrop-blur-sm h-full mx-auto shadow-lg hover:bg-white/10 transition-colors">
                    <CardHeader className="pb-2">
                        <Quote className="h-6 w-6 text-primary/40 mb-2" />
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-primary/20">
                                <AvatarImage
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {testimonial.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold text-base">
                                    {testimonial.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {testimonial.project}
                                    {testimonial.platform && (
                                        <>
                                            {" via "}
                                            <span className="text-primary/80">
                                                {testimonial.platform}
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-4">
                            &quot;{testimonial.content}&quot;
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const handleDragEnd = () => {
        const currentX = x.get();
        const width = containerRef.current?.offsetWidth || window.innerWidth;
        const threshold = width * 0.25;

        if (currentX < -threshold) {
            // Swipe Left -> Next
            animate(x, -width, {
                duration: 0.2,
                ease: "easeOut",
                onComplete: () => {
                    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
                    x.set(0);
                },
            });
        } else if (currentX > threshold) {
            // Swipe Right -> Prev
            animate(x, width, {
                duration: 0.2,
                ease: "easeOut",
                onComplete: () => {
                    setCurrentIndex(
                        (prev) =>
                            (prev - 1 + testimonials.length) %
                            testimonials.length
                    );
                    x.set(0);
                },
            });
        } else {
            // Snap back
            animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
        }
    };

    if (testimonials.length === 0) return null;

    return (
        <section className="py-12 md:py-24 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Testimonials
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    What others say about working with me
                </p>
            </div>

            {/* Mobile View - Auto Carousel */}
            <div
                ref={containerRef}
                className="md:hidden container mx-auto px-4 relative flex w-full flex-col items-center justify-center min-h-[300px] overflow-hidden touch-none"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                <motion.div
                    className="relative w-full h-[250px] flex items-center justify-center cursor-grab active:cursor-grabbing"
                    drag="x"
                    // Free drag
                    style={{ x }}
                    dragElastic={1}
                    onDragEnd={handleDragEnd}
                >
                    {/* Render Prev, Current, Next */}
                    {renderCard(prevIndex, -1)}
                    {renderCard(currentIndex, 0)}
                    {renderCard(nextIndex, 1)}
                </motion.div>

                {/* Indicators */}
                <div className="flex gap-2 mt-6">
                    {testimonials.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                                index === currentIndex
                                    ? "bg-primary"
                                    : "bg-primary/20"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Desktop View - Marquee */}
            <div className="hidden md:flex relative w-full flex-col items-center justify-center overflow-hidden">
                <Marquee pauseOnHover className="[--duration:20s]">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="w-[400px] flex-none border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 mx-4"
                        >
                            <CardHeader className="pb-2">
                                <Quote className="h-8 w-8 text-primary/40 mb-2" />
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                                        <AvatarImage
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                        />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {testimonial.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {testimonial.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.project}
                                            {testimonial.platform && (
                                                <>
                                                    {" via "}
                                                    <span className="text-primary/80">
                                                        {testimonial.platform}
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-foreground/80 italic leading-relaxed">
                                    &quot;{testimonial.content}&quot;
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
