import { Testimonial } from "@/types/testimonial";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Marquee } from "@/components/ui/marquee";
import { Quote } from "lucide-react";

interface TestimonialsProps {
    testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
    if (testimonials.length === 0) return null;

    return (
        <section className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Testimonials
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    What others say about working with me
                </p>
            </div>
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                <Marquee pauseOnHover className="[--duration:20s]">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="w-[300px] md:w-[400px] flex-none border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 mx-4"
                        >
                            <CardHeader className="pb-2">
                                <Quote className="h-8 w-8 text-primary/40 mb-2" />
                                <div className="flex items-center gap-4">
                                    <Avatar className="border-2 border-primary/20">
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
                                            {testimonial.role} at{" "}
                                            <span className="text-primary/80">
                                                {testimonial.company}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-muted-foreground italic leading-relaxed">
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
