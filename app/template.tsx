"use client";

import { m } from "framer-motion";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/components/providers/navigation-provider";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { previousPath } = useNavigation();

  // Check if we are on the projects page and came from a project details page
  const isBackFromProjectDetails =
    pathname === "/projects" &&
    previousPath?.startsWith("/projects/") &&
    previousPath !== "/projects";

  // Keep initial SSR load at opacity: 1 so above-the-fold hero content paints immediately without LCP delay
  const shouldAnimate = previousPath !== null && !isBackFromProjectDetails;

  return (
    <m.div
      initial={shouldAnimate ? { y: 12, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={
        shouldAnimate ? { ease: "easeOut", duration: 0.35 } : { duration: 0 }
      }
      className="flex-1 flex flex-col"
    >
      {children}
    </m.div>
  );
}
