"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface DecryptedTextProps {
    text: string;
    speed?: number;
    maxIterations?: number;
    sequential?: boolean;
    revealDirection?: "start" | "end" | "center";
    useHover?: boolean;
    className?: string;
    animateOnMount?: boolean;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]|;:,.<>?";

export const DecryptedText = ({
    text,
    speed = 50,
    maxIterations = 10,
    sequential = true,
    revealDirection = "start",
    useHover = true,
    className = "",
    animateOnMount = true
}: DecryptedTextProps) => {
    const [displayText, setDisplayText] = useState(text);
    const [isAnimating, setIsAnimating] = useState(false);

    const shuffle = useCallback((targetText: string, iterations: number) => {
        return targetText
            .split("")
            .map((char, index) => {
                if (char === " ") return " ";
                if (sequential) {
                    const threshold = iterations / maxIterations;
                    let isResolved = false;

                    if (revealDirection === "start") isResolved = index / targetText.length < threshold;
                    else if (revealDirection === "end") isResolved = (targetText.length - index) / targetText.length < threshold;
                    else isResolved = Math.abs(index - targetText.length / 2) / (targetText.length / 2) > 1 - threshold;

                    if (isResolved) return char;
                }
                return characters[Math.floor(Math.random() * characters.length)];
            })
            .join("");
    }, [sequential, maxIterations, revealDirection]);

    const startAnimation = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        let iterations = 0;

        const interval = setInterval(() => {
            setDisplayText(shuffle(text, iterations));
            iterations++;

            if (iterations >= maxIterations) {
                setDisplayText(text);
                setIsAnimating(false);
                clearInterval(interval);
            }
        }, speed);
    }, [isAnimating, text, shuffle, maxIterations, speed]);

    useEffect(() => {
        if (animateOnMount) {
            startAnimation();
        }
    }, []);

    return (
        <motion.span
            onMouseEnter={useHover ? startAnimation : undefined}
            className={`inline-block font-mono ${className}`}
        >
            {displayText}
        </motion.span>
    );
};
