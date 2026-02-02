"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Power, Clock, Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface SilenceModeOverlayProps {
    isActive: boolean;
    onDismiss: () => void;
}

export const SilenceModeOverlay = ({ isActive, onDismiss }: SilenceModeOverlayProps) => {
    const [countdown, setCountdown] = useState(900); // 15 minutes in seconds
    const [canOverride, setCanOverride] = useState(false);

    useEffect(() => {
        if (!isActive) return;

        // Allow override after 5 minutes
        const overrideTimer = setTimeout(() => {
            setCanOverride(true);
        }, 300000); // 5 minutes

        // Countdown timer
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onDismiss();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearTimeout(overrideTimer);
            clearInterval(interval);
        };
    }, [isActive, onDismiss]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 backdrop-blur-3xl"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="max-w-2xl mx-4 text-center space-y-8"
                    >
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30"
                        >
                            <Power className="w-16 h-16 text-blue-400" />
                        </motion.div>

                        {/* Message */}
                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                            >
                                Silence Mode
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-blue-200/80 max-w-lg mx-auto leading-relaxed"
                            >
                                We&apos;ve detected patterns that suggest you might need a break.
                            </motion.p>
                        </div>

                        {/* Reasons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10"
                        >
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <Heart className="w-5 h-5 text-red-400" />
                                <h3 className="text-lg font-bold text-white">Why this matters</h3>
                            </div>
                            <p className="text-blue-200/70 text-sm leading-relaxed">
                                Continuous scrolling and rapid interactions can lead to mental fatigue.
                                Taking regular breaks helps maintain focus, creativity, and wellbeing.
                            </p>
                        </motion.div>

                        {/* Countdown */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-center space-x-2 text-blue-300/60">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">Resuming in</span>
                            </div>
                            <div className="text-6xl font-bold text-white tabular-nums">
                                {formatTime(countdown)}
                            </div>
                        </motion.div>

                        {/* Override Button */}
                        {canOverride && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={onDismiss}
                                className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm font-semibold text-white transition-all"
                            >
                                I understand, continue anyway
                            </motion.button>
                        )}

                        {/* Suggestions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-xs text-blue-300/40 space-y-1"
                        >
                            <p>💡 Try: Take a walk, stretch, or grab some water</p>
                            <p>🌙 Your wellbeing matters more than the feed</p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
