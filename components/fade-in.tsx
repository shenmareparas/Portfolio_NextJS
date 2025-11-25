"use client";

import { motion } from "framer-motion";

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
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
