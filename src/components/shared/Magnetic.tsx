"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

/**
 * A wrapper component that creates a magnetic pull effect towards the center
 * of the element when the mouse is nearby.
 */
export default function Magnetic({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const target = ref.current;
        if (!target) return;

        const { width, height, left, top } = target.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        // Limit the pull to a specific range (e.g., 0.5 of the distance)
        setPosition({ x: middleX * 0.5, y: middleY * 0.5 });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.div
            style={{ position: "relative" }}
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x, y }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1
            }}
        >
            {children}
        </motion.div>
    );
}
