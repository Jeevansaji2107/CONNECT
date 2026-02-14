"use client";

import { motion } from "framer-motion";

interface GlitchSkeletonProps {
    className?: string;
    variant?: "rect" | "circle" | "text";
}

export const GlitchSkeleton = ({ className = "", variant = "rect" }: GlitchSkeletonProps) => {
    return (
        <div className={`relative overflow-hidden bg-secondary/30 ${variant === "circle" ? "rounded-full" : "rounded-2xl"} ${className}`}>
            {/* Shimmer Effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                animate={{
                    x: ["-100%", "100%"]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Glitch Overlay */}
            <motion.div
                className="absolute inset-0 bg-primary/10 mix-blend-overlay"
                animate={{
                    opacity: [0, 0.2, 0, 0.5, 0],
                    x: [0, 2, -2, 4, 0],
                }}
                transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    repeatDelay: Math.random() * 2
                }}
            />

            {/* Technical Lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-primary" />
                <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-primary" />
                <div className="absolute top-[80%] left-0 right-0 h-[1px] bg-primary" />
            </div>
        </div>
    );
};
