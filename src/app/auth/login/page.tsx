"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Logo } from "@/components/shared/Logo";
import { Github, Mail, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { loginGitHub, loginGoogle, loginDemo } from "@/lib/actions/auth-actions";

export default function LoginPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#020617] to-black">
            {/* Animated Particles */}
            {/* Animated Particles - Full Screen Fixed */}
            {mounted && (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    {[...Array(40)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                                opacity: Math.random() * 0.5 + 0.1,
                                scale: Math.random() * 0.5 + 0.5,
                            }}
                            animate={{
                                y: [null, Math.random() * -100],
                                x: [null, (Math.random() - 0.5) * 50],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "reverse"
                            }}
                            className="absolute w-1 h-1 bg-blue-500/50 rounded-full blur-[1px]"
                        />
                    ))}
                </div>
            )}

            {/* Subtle Blue Glows */}
            <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-10 text-center space-y-10 border border-blue-500/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)]">
                    <div className="flex flex-col items-center space-y-6">
                        <motion.div
                            initial={{ rotate: -10, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        >
                            <Logo size="lg" />
                        </motion.div>
                        <div className="space-y-3">
                            <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">Connect</h1>
                            <p className="text-muted tracking-wide text-xs font-semibold uppercase opacity-60">Sign in to your account</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(59,130,246,0.05)" }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            onClick={() => loginGitHub()}
                            className="w-full glass py-4 px-6 flex items-center justify-center space-x-4 transition-all group border border-white/5 rounded-2xl"
                        >
                            <Github className="w-5 h-5 group-hover:scale-110 text-primary transition-transform" />
                            <span className="font-bold text-xs tracking-widest uppercase">Continue with GitHub</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(59,130,246,0.05)" }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            onClick={() => loginGoogle()}
                            className="w-full glass py-4 px-6 flex items-center justify-center space-x-4 transition-all group border border-white/5 rounded-2xl"
                        >
                            <Mail className="w-5 h-5 group-hover:scale-110 text-primary transition-transform" />
                            <span className="font-bold text-xs tracking-widest uppercase">Continue with Google</span>
                        </motion.button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/5" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.4em] font-bold text-muted">
                            <span className="bg-[#0c0c0c] px-4">OR</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            onClick={() => loginDemo()}
                            className="btn-primary w-full py-5 rounded-2xl transition-all flex items-center justify-center space-x-3 relative overflow-hidden group"
                        >
                            <Zap className="w-5 h-5 fill-current" />
                            <span className="tracking-widest uppercase text-xs font-bold">Use Demo Account</span>
                        </motion.button>
                        <p className="text-[9px] text-muted font-bold uppercase tracking-[0.2em] opacity-30">
                            Secure • Encrypted • Professional
                        </p>
                    </div>

                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-[280px] mx-auto">
                        Connecting to the system implies agreement with our <Link href="#" className="underline text-foreground">Core Protocols</Link> and <Link href="#" className="underline text-foreground">Security Mandates</Link>.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
