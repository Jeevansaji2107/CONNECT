"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Logo } from "@/components/shared/Logo";
import { Github, Mail, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { loginGitHub, loginGoogle, loginDemo } from "@/lib/actions/auth-actions";

export default function LoginPage() {
    const [mounted, setMounted] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [particles, setParticles] = useState<{ x: number, y: number, opacity: number, scale: number, animateY: number, animateX: number, duration: number }[]>([]);

    useEffect(() => {
        // Deferring the particle generation and mounted state update to ensure it runs after initial render
        // and to avoid potential hydration mismatches if window dimensions are used immediately.
        const timeoutId = setTimeout(() => {
            setMounted(true);
            const newParticles = [...Array(40)].map(() => ({
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                opacity: Math.random() * 0.5 + 0.1,
                scale: Math.random() * 0.5 + 0.5,
                animateY: Math.random() * -100,
                animateX: (Math.random() - 0.5) * 50,
                duration: Math.random() * 10 + 10,
            }));
            setParticles(newParticles);
        }, 0); // Using setTimeout(0) to push execution to the end of the current event loop cycle

        // Cleanup function to clear the timeout if the component unmounts before it fires
        return () => clearTimeout(timeoutId);
    }, []); // Empty dependency array ensures this effect runs only once after the initial render

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#020617] to-black">
            {/* Monitor Glow Effect */}
            <div className="fixed inset-0 pointer-events-none z-0 shadow-[inset_0_0_150px_rgba(59,130,246,0.3)] border-[1px] border-blue-500/20" />
            <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)]" />

            {/* Animated Particles */}
            {/* Animated Particles - Full Screen Fixed */}
            {mounted && (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    {particles.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x: p.x,
                                y: p.y,
                                opacity: p.opacity,
                                scale: p.scale,
                            }}
                            animate={{
                                y: [null, p.animateY],
                                x: [null, p.animateX],
                            }}
                            transition={{
                                duration: p.duration,
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
                <div className="glass-card p-10 text-center space-y-10 border border-blue-500/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)] relative overflow-hidden">
                    {/* Inner Card Glow */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />

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
                        <div className="flex items-center justify-center space-x-2 pb-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/50 transition-colors cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-[10px] text-muted font-bold uppercase tracking-wider cursor-pointer select-none">
                                I agree to the <button onClick={() => setShowTerms(true)} className="text-foreground hover:underline hover:text-blue-400 transition-colors ml-1">Terms & Conditions</button>
                            </label>
                        </div>

                        <motion.button
                            whileHover={termsAccepted ? { scale: 1.02, backgroundColor: "rgba(59,130,246,0.05)" } : {}}
                            whileTap={termsAccepted ? { scale: 0.98 } : {}}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            onClick={() => termsAccepted ? loginGitHub() : null}
                            disabled={!termsAccepted}
                            className={`w-full glass py-4 px-6 flex items-center justify-center space-x-4 transition-all group border border-white/5 rounded-2xl ${!termsAccepted ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            <Github className="w-5 h-5 group-hover:scale-110 text-primary transition-transform" />
                            <span className="font-bold text-xs tracking-widest uppercase">Continue with GitHub</span>
                        </motion.button>

                        <motion.button
                            whileHover={termsAccepted ? { scale: 1.02, backgroundColor: "rgba(59,130,246,0.05)" } : {}}
                            whileTap={termsAccepted ? { scale: 0.98 } : {}}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            onClick={() => termsAccepted ? loginGoogle() : null}
                            disabled={!termsAccepted}
                            className={`w-full glass py-4 px-6 flex items-center justify-center space-x-4 transition-all group border border-white/5 rounded-2xl ${!termsAccepted ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer"}`}
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
                            whileHover={termsAccepted ? { scale: 1.02 } : {}}
                            whileTap={termsAccepted ? { scale: 0.98 } : {}}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            onClick={() => termsAccepted ? loginDemo() : null}
                            disabled={!termsAccepted}
                            className={`btn-primary w-full py-5 rounded-2xl transition-all flex items-center justify-center space-x-3 relative overflow-hidden group ${!termsAccepted ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            <Zap className="w-5 h-5 fill-current" />
                            <span className="tracking-widest uppercase text-xs font-bold">Use Demo Account</span>
                        </motion.button>
                        <p className="text-[9px] text-muted font-bold uppercase tracking-[0.2em] opacity-30">
                            Secure • Encrypted • Professional
                        </p>
                    </div>

                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-[280px] mx-auto">
                        Connecting to the system implies agreement with our Core Protocols and Security Mandates.
                    </p>
                </div>
            </motion.div>

            {/* Terms Modal */}
            {showTerms && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass-card max-w-2xl w-full max-h-[80vh] flex flex-col border border-blue-500/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <div className="flex items-center space-x-3">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold tracking-wide uppercase text-foreground">Terms & Conditions</h2>
                            </div>
                            <button onClick={() => setShowTerms(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <span className="text-xs font-bold uppercase">Close</span>
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto space-y-6 text-sm text-muted-foreground leading-relaxed custom-scrollbar">
                            <p><strong className="text-foreground">1. Introduction</strong><br />Welcome to Connect. By accessing our secure network, you agree to be bound by these Terms and Conditions.</p>
                            <p><strong className="text-foreground">2. User Conduct</strong><br />You agree to use the platform responsibly. Hate speech, harassment, and illegal activities are strictly prohibited and will result in immediate termination.</p>
                            <p><strong className="text-foreground">3. Data Privacy</strong><br />We employ advanced encryption to protect your data. However, you acknowledge that no system is impenetrable. By using Connect, you consent to our data collection practices as outlined in our Privacy Policy.</p>
                            <p><strong className="text-foreground">4. Intellectual Property</strong><br />All content created by you remains your property. You grant Connect a non-exclusive license to display and distribute your content within the platform.</p>
                            <p><strong className="text-foreground">5. Termination</strong><br />We reserve the right to suspend or terminate your account at any time for violation of these terms.</p>
                            <p><strong className="text-foreground">6. Modifications</strong><br />We may update these terms at any time. Continued use of the platform constitutes acceptance of the new terms.</p>
                        </div>
                        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
                            <button
                                onClick={() => { setShowTerms(false); setTermsAccepted(true); }}
                                className="btn-primary py-3 px-8 text-xs font-bold uppercase tracking-widest"
                            >
                                Accept & Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
