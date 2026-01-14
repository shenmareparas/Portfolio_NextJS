"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [testimonials.length, isPaused]);

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

    const handleDragEnd = (e: any, { offset, velocity }: any) => {
        const swipe = swipePower(offset.x, velocity.x);

        if (swipe < -swipeConfidenceThreshold) {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        } else if (swipe > swipeConfidenceThreshold) {
            setDirection(-1);
            setCurrentIndex(
                (prev) => (prev - 1 + testimonials.length) % testimonials.length
            );
        }
    };

    if (testimonials.length === 0) return null;

    const testimonial = testimonials[currentIndex];

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

            {/* Mobile View - AnimatePresence Carousel */}
            <div
                className="md:hidden container mx-auto px-4 relative flex w-full flex-col items-center justify-center min-h-[300px] overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                <div className="relative w-full h-[250px] flex items-center justify-center">
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
                            <Card className="w-full h-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg">
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
                                                            {
                                                                testimonial.platform
                                                            }
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
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Indicators */}
                <div className="flex gap-2 mt-6 z-10">
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
