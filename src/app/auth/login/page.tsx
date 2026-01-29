"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/shared/Logo";
import { Github, Mail, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { loginGitHub, loginGoogle, loginDemo } from "@/lib/actions/auth-actions";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#030303]">
            {/* Immersive Background Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-connect-blue/20 blur-[130px] rounded-full"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -40, 0],
                    y: [0, -60, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-connect-magenta/15 blur-[150px] rounded-full"
            />
            <motion.div
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-connect-purple/10 blur-[180px] rounded-full"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-10 text-center space-y-10 border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)]">
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
