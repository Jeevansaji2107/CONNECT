"use client";

import { motion } from "framer-motion";

interface CyberPulseProps {
    isOnline: boolean;
    className?: string;
}

export const CyberPulse = ({ isOnline, className = "" }: CyberPulseProps) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <motion.div
                initial={false}
                animate={{
                    scale: isOnline ? [1, 1.5, 1] : 1,
                    opacity: isOnline ? [0.6, 0.2, 0.6] : 0.3
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`absolute inset-0 rounded-full ${isOnline ? "bg-emerald-500" : "bg-muted"}`}
            />
            <div className={`relative w-2 h-2 rounded-full border border-white/20 ${isOnline ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-muted-foreground/40"}`} />
        </div>
    );
};
