"use client";

import { m } from "framer-motion";
import { useNavigation } from "@/components/providers/navigation-provider";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
}: FadeInProps) {
  const { previousPath } = useNavigation();
  // Avoid hiding SSR HTML with opacity: 0 on initial page load
  const shouldAnimate = previousPath !== null;

  return (
    <m.div
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldAnimate ? { duration, delay } : { duration: 0 }}
      className={className}
    >
      {children}
    </m.div>
  );
}
