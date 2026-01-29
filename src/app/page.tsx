"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashState, setSplashState] = useState<'black' | 'ready'>('black');

  useEffect(() => {
    // Stage 1: Initial black screen 
    const t1 = setTimeout(() => {
      setSplashState('ready');
    }, 800);

    // Stage 2: Fade out splash
    const t2 = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const titleChars = "Connect.".split("");

  return (
    <div className="relative">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[1000] bg-black flex items-center justify-center text-center px-4"
          >
            <AnimatePresence mode="wait">
              {splashState === 'ready' && (
                <motion.div
                  key="ready-text"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3"
                >
                  <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                    All systems ready.
                  </h2>
                  <p className="text-muted font-semibold text-xl opacity-40">
                    Entering Connect...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-12 relative overflow-hidden">
        {/* Modern Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[140px] rounded-full pointer-events-none opacity-50" />

        <div className="space-y-8 relative z-10 max-w-4xl">
          <div className="space-y-6">
            <h1 className="text-7xl md:text-9xl font-black tracking-tight text-foreground flex justify-center">
              {titleChars.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4 + (i * 0.1),
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className={char === "." ? "text-primary" : ""}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-muted font-medium max-w-xl mx-auto leading-relaxed"
            >
              The world&apos;s most elegant social intelligence platform.
              Connect with thinkers, creators, and leaders.
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 relative z-10"
        >
          <Link
            href="/auth/login"
            className="btn-primary px-12 py-4 text-sm font-bold"
          >
            Get Started
          </Link>
          <Link
            href="/feed"
            className="btn-outline px-12 py-4 text-sm font-bold"
          >
            Explore Feed
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
