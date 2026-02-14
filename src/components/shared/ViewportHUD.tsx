"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export const ViewportHUD = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
            {/* Corner Markers */}
            <CornerMarker position="top-left" />
            <CornerMarker position="top-right" />
            <CornerMarker position="bottom-left" />
            <CornerMarker position="bottom-right" />

            {/* Side Data Streams */}
            <div className="absolute top-[20%] left-6 bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-primary/20 to-transparent flex flex-col items-center justify-between py-10 opacity-40">
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                <div className="w-1 h-20 bg-primary/20 rounded-full" />
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
            </div>

            <div className="absolute top-[20%] right-6 bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-primary/20 to-transparent flex flex-col items-center justify-between py-10 opacity-40">
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                <div className="w-1 h-20 bg-primary/20 rounded-full" />
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
            </div>
        </div>
    );
};

const CornerMarker = ({ position }: { position: string }) => {
    const isTop = position.includes("top");
    const isLeft = position.includes("left");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute ${isTop ? "top-8" : "bottom-8"} ${isLeft ? "left-8" : "right-8"} w-16 h-16 opacity-30`}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                    d={isTop
                        ? (isLeft ? "M 20 0 L 0 0 L 0 20" : "M 80 0 L 100 0 L 100 20")
                        : (isLeft ? "M 20 100 L 0 100 L 0 80" : "M 80 100 L 100 100 L 100 80")
                    }
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeLinecap="square"
                />
                <motion.circle
                    cx={isLeft ? 0 : 100}
                    cy={isTop ? 0 : 100}
                    r="3"
                    fill="var(--primary)"
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </svg>
        </motion.div>
    );
};



