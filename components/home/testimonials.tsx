"use client";

import { useState, useEffect, useRef } from "react";

import { Testimonial } from "@/types/testimonial";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";

const TITLE_PREFIX_RE = /^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Prof\.?|Sir|Sr\.?|Jr\.?)$/i;

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((word) => !TITLE_PREFIX_RE.test(word))
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StarRating({
  stars = 5,
  className,
}: {
  stars?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-0.5", className)}>
      <span className="sr-only">{stars} out of 5 stars</span>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "h-3.5 w-3.5",
            i < stars
              ? "fill-foreground text-foreground"
              : "fill-muted text-muted-foreground/20",
          )}
        >
          <use href="#testimonial-star" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  variant,
}: {
  testimonial: Testimonial;
  variant: "mobile" | "desktop";
}) {
  const isDesktop = variant === "desktop";

  return (
    <Card
      tabIndex={isDesktop ? 0 : undefined}
      className={cn(
        "flex-none border border-zinc-200/50 dark:border-white/5 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-md shadow-xl",
        isDesktop
          ? "w-[450px] mx-6 transition-[border-color,background-color] duration-300 hover:border-zinc-300/50 dark:hover:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          : "w-[85vw] max-w-[350px] snap-center snap-always",
      )}
    >
      <CardHeader className={isDesktop ? "pb-5" : "pb-4"}>
        <div className="flex items-start justify-between">
          <div
            className={cn("flex items-center", isDesktop ? "gap-4" : "gap-3")}
          >
            <Avatar
              className={cn(
                "border border-zinc-200 dark:border-white/10",
                isDesktop ? "h-11 w-11" : "h-10 w-10",
              )}
            >
              {testimonial.image && (
                <AvatarImage src={testimonial.image} alt={testimonial.name} />
              )}
              <AvatarFallback
                className={cn(
                  "bg-primary/5 text-primary font-medium",
                  isDesktop ? "text-sm" : "text-xs",
                )}
              >
                {getInitials(testimonial.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3
                className={cn(
                  "font-semibold leading-none mb-1.5",
                  isDesktop ? "text-base" : "text-sm",
                )}
              >
                {testimonial.name}
              </h3>
              <div
                className={cn(
                  "flex items-center text-muted-foreground font-medium",
                  isDesktop ? "gap-2 text-xs" : "gap-1.5 text-[11px]",
                )}
              >
                <span>{testimonial.project}</span>
                {testimonial.platform && (
                  <>
                    <span className="text-border" aria-hidden="true">
                      •
                    </span>
                    <span className="text-muted-foreground">
                      {testimonial.platform}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            className={cn(
              "flex flex-col items-end",
              isDesktop ? "gap-2" : "gap-1.5",
            )}
          >
            <StarRating stars={testimonial.stars} />
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn("pt-0", isDesktop && "pb-6")}>
        <p
          className={cn(
            "text-[15px] font-normal",
            isDesktop
              ? "text-foreground/80 leading-7 tracking-wide"
              : "text-foreground/90 leading-relaxed",
          )}
        >
          {testimonial.content}
        </p>
      </CardContent>
    </Card>
  );
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [isMobilePaused, setIsMobilePaused] = useState(false);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobilePaused || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      if (scrollRef.current && window.innerWidth < 768) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const firstChild = scrollRef.current.children[0] as HTMLElement;
          const itemWidth = firstChild
            ? firstChild.offsetWidth + 16
            : clientWidth * 0.85;
          scrollRef.current.scrollBy({
            left: itemWidth,
            behavior: "smooth",
          });
        }
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [testimonials.length, isMobilePaused]);

  if (testimonials.length === 0) return null;

  return (
    <section className="defer-offscreen-section w-full max-w-full py-12 md:py-24 lg:py-32 overflow-hidden">
      <svg
        aria-hidden="true"
        width={0}
        height={0}
        className="absolute w-0 h-0 overflow-hidden pointer-events-none"
      >
        <symbol id="testimonial-star" viewBox="0 0 24 24">
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </symbol>
      </svg>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4 text-center mb-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Testimonials
        </h2>
        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          What others say about working with me
        </p>
      </div>

      {/* Mobile View - Native Auto/Manual Scroll Container */}
      <div
        className="md:hidden w-full max-w-full relative overflow-hidden"
        onMouseEnter={() => setIsMobilePaused(true)}
        onMouseLeave={() => setIsMobilePaused(false)}
        onTouchStart={() => setIsMobilePaused(true)}
        onTouchEnd={() => setIsMobilePaused(false)}
      >
        <div
          ref={scrollRef}
          className="flex w-full overflow-x-auto snap-x snap-mandatory gap-4 px-4 py-8 scroll-smooth no-scrollbar"
        >
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              variant="mobile"
            />
          ))}
        </div>
      </div>

      {/* Desktop View - Marquee */}
      <div className="hidden md:flex relative w-full max-w-full flex-col items-center justify-center overflow-hidden">
        <Marquee
          pauseOnHover
          paused={isMarqueePaused}
          repeat={2}
          className="[--duration:40s] py-12"
        >
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              variant="desktop"
            />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background dark:from-background" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background dark:from-background" />
        <button
          type="button"
          onClick={() => setIsMarqueePaused((prev) => !prev)}
          aria-label={
            isMarqueePaused
              ? "Resume testimonials carousel"
              : "Pause testimonials carousel"
          }
          className="relative z-10 mt-2 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
        >
          {isMarqueePaused ? (
            <>
              <Play className="h-3 w-3" aria-hidden="true" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="h-3 w-3" aria-hidden="true" />
              <span>Pause</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
