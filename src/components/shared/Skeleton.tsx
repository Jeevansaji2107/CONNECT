"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    circle?: boolean;
}

export const Skeleton = ({ className = "", width, height, circle = false }: SkeletonProps) => {
    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={`bg-white/5 relative overflow-hidden ${circle ? "rounded-full" : "rounded-xl"} ${className}`}
            style={{ width, height }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </motion.div>
    );
};
