"use client";

import { motion } from "framer-motion";

export const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const heights = {
        sm: "h-8",
        md: "h-10",
        lg: "h-16",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center cursor-pointer ${heights[size]} w-auto`}
        >
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <span className="text-primary font-black text-2xl select-none">C</span>
            </div>

            <div className="ml-2 font-bold text-2xl tracking-tight text-foreground hidden md:block">
                Connect
            </div>
        </motion.div>
    );
};
