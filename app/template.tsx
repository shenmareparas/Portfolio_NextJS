"use client";

import { motion } from "framer-motion";
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

    return (
        <motion.div
            initial={
                isBackFromProjectDetails
                    ? { opacity: 1 }
                    : { y: 20, opacity: 0 }
            }
            animate={
                isBackFromProjectDetails ? { opacity: 1 } : { y: 0, opacity: 1 }
            }
            transition={{ ease: "easeInOut", duration: 0.75 }}
            className="flex-1 flex flex-col"
        >
            {children}
        </motion.div>
    );
}
