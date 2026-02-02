"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export const BackgroundEngine = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMounted, setIsMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const [nodes, setNodes] = useState<any[]>([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsMounted(true);
            const newNodes = [...Array(20)].map(() => ({
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                duration: 10 + Math.random() * 15,
                delay: Math.random() * 20,
            }));
            setNodes(newNodes);
        }, 0);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const springConfig = { damping: 25, stiffness: 150 };
    const mouseXSpring = useSpring(mousePos.x, springConfig);
    const mouseYSpring = useSpring(mousePos.y, springConfig);

    if (!isMounted) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#020617]">
            {/* Interactive Grid */}
            <motion.div
                className="absolute inset-0 opacity-[0.1]"
                style={{
                    backgroundImage: `radial-gradient(circle at ${mouseXSpring}px ${mouseYSpring}px, var(--primary) 0%, transparent 60%), linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
                    backgroundSize: "100% 100%, 40px 40px, 40px 40px",
                }}
            />

            {/* Floating Data Nodes */}
            <div className="absolute inset-0">
                {nodes.map((node, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/30 rounded-full"
                        initial={{
                            x: node.x,
                            y: node.y,
                            opacity: 0
                        }}
                        animate={{
                            y: ["-10%", "110%"],
                            opacity: [0, 1, 1, 0],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: node.duration,
                            repeat: Infinity,
                            delay: node.delay,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Noise Layer */}
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};
