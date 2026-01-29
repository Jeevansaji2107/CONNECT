"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const chars = "ABCDEF0123456789X_";

export const CharacterSwap = ({ text }: { text: string }) => {
    const [displayText, setDisplayText] = useState(text);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isHovered) {
            interval = setInterval(() => {
                setDisplayText(
                    text
                        .split("")
                        .map(() => chars[Math.floor(Math.random() * chars.length)])
                        .join("")
                );
            }, 50);
        } else if (displayText !== text) {
            setTimeout(() => setDisplayText(text), 0);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isHovered, text, displayText]);

    return (
        <motion.span
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`inline-block cursor-pointer font-mono transition-colors uppercase tracking-widest ${isHovered ? "text-connect-accent font-black shadow-[0_0_10px_var(--accent-glow)]" : ""}`}
        >
            {displayText}
        </motion.span>
    );
};
