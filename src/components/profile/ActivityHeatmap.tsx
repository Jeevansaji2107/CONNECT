"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const ActivityHeatmap = () => {
    const [mounted, setMounted] = useState(false);
    const [activityData, setActivityData] = useState<number[][]>([]);

    useEffect(() => {
        // Generate stable random data on mount (client-side only)
        const data = Array.from({ length: 20 }, () =>
            Array.from({ length: 7 }, () => Math.random())
        );
        setTimeout(() => {
            setActivityData(data);
            setMounted(true);
        }, 0);
    }, []);

    if (!mounted) {
        return (
            <div className="space-y-4 opacity-0 h-[100px]" />
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] terminal-text opacity-50">Pulse_Data</h3>
                <div className="flex items-center space-x-2 text-[9px] font-mono text-muted-foreground">
                    <span>Low</span>
                    {[0.1, 0.3, 0.6, 0.9].map((op) => (
                        <div key={op} className="w-2.5 h-2.5 rounded-sm bg-connect-accent" style={{ opacity: op }} />
                    ))}
                    <span>High</span>
                </div>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
                <div className="flex flex-col gap-1 text-[9px] font-mono text-muted-foreground/40 pr-2 justify-between py-1 uppercase">
                    {days.map((day, i) => (
                        <span key={day} className={i % 2 === 0 ? "invisible" : ""}>{day}</span>
                    ))}
                </div>
                <div className="flex gap-1">
                    {activityData.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-1">
                            {week.map((intensity, di) => (
                                <motion.div
                                    key={di}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: (wi * 7 + di) * 0.002 }}
                                    className="w-2.5 h-2.5 rounded-sm bg-connect-accent shadow-[0_0_5px_var(--accent-glow)]"
                                    style={{
                                        opacity: intensity > 0.8 ? 0.9 : intensity > 0.5 ? 0.5 : intensity > 0.2 ? 0.2 : 0.05
                                    }}
                                    whileHover={{
                                        scale: 1.5,
                                        zIndex: 10,
                                        opacity: 1,
                                        backgroundColor: "var(--accent)"
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
