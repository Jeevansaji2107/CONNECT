"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1]
            }}
        >
            {children}
        </motion.div>
    );
}
