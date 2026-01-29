"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/shared/Logo";
import { User, Sparkles, Zap, ArrowRight, Check } from "lucide-react";

const steps = [
    {
        id: "profile",
        title: "Create Your Identity",
        description: "Set up your basic profile information to represent yourself on Connect.",
        icon: <User className="w-6 h-6" />,
    },
    {
        id: "interests",
        title: "Personalize Feed",
        description: "Select topics that interest you for a curated social experience.",
        icon: <Sparkles className="w-6 h-6" />,
    },
    {
        id: "finish",
        title: "Ready to go!",
        description: "Your professional social console is now calibrated and ready.",
        icon: <Check className="w-6 h-6" />,
    },
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                layout
                className="w-full max-w-2xl card-simple bg-white dark:bg-card p-1 relative z-10"
            >
                <div className="p-8 pb-4 flex justify-between items-center bg-secondary/30 rounded-t-3xl border-b border-border">
                    <Logo size="sm" />
                    <div className="flex space-x-2">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-10 rounded-full transition-all duration-700 ${i <= currentStep ? "bg-primary" : "bg-border"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -10, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-10"
                        >
                            <div className="space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    {steps[currentStep].icon}
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">{steps[currentStep].title}</h2>
                                    <p className="text-muted font-medium leading-relaxed">{steps[currentStep].description}</p>
                                </div>
                            </div>

                            {currentStep === 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-muted tracking-widest ml-1">Username</label>
                                        <input className="input-google w-full" placeholder="@username" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-muted tracking-widest ml-1">Full Name</label>
                                        <input className="input-google w-full" placeholder="Your Name" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] uppercase font-black text-muted tracking-widest ml-1">Professional Bio</label>
                                        <textarea className="input-google w-full min-h-[120px] resize-none" placeholder="Tell the world who you are..." />
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                                    {["Technology", "Design", "AI", "Engineering", "Marketing", "Business", "Product", "Social", "Data"].map((tag) => (
                                        <button key={tag} className="card-simple py-4 px-4 text-sm font-bold hover:bg-primary hover:text-white hover:border-primary transition-all">
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-8 pt-4">
                                    <div className="card-simple p-8 border-primary/20 bg-primary/5 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary">
                                                <Zap className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="font-extrabold text-xl">System Optimized</div>
                                                <div className="text-sm text-muted font-medium">Your feed is ready for engagement.</div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center text-muted font-medium italic px-4">
                                        &quot;Calibrating your experience for maximum clarity and best-in-class social interaction...&quot;
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-16 flex justify-between items-center">
                        <button
                            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                            disabled={currentStep === 0}
                            className={`text-sm font-bold transition-all ${currentStep === 0 ? "opacity-0" : "text-muted hover:text-foreground"}`}
                        >
                            Previous Step
                        </button>
                        <button
                            onClick={nextStep}
                            className="btn-primary space-x-3 px-10 py-4 shadow-xl shadow-primary/25"
                        >
                            <span className="text-sm font-black uppercase tracking-widest">{currentStep === steps.length - 1 ? "Start Connecting" : "Next Phase"}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
