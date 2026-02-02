"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Check, Loader2 } from "lucide-react";
import { User } from "@/lib/types";
import { updateProfile } from "@/lib/actions/user-actions";
import { toast } from "sonner";
import Image from "next/image";

interface EditProfileDialogProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileDialog = ({ user, isOpen, onClose }: EditProfileDialogProps) => {
    const [name, setName] = useState(user.name || "");
    const [bio, setBio] = useState(user.bio || "");
    const [image, setImage] = useState(user.image || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        setIsSaving(true);
        try {
            const res = await updateProfile({ name, bio, image });
            if (res.success) {
                toast.success("Profile Synchronized");
                onClose();
            } else {
                toast.error(res.error || "Update failed");
            }
        } catch (error) {
            toast.error("Critical System Failure during update");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center overflow-hidden"
                    >
                        {/* Animated Cyber Car Wireframe Background */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none scale-150 md:scale-[2]">
                            <motion.svg
                                width="400"
                                height="200"
                                viewBox="0 0 400 200"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                initial={{ y: 0 }}
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {/* Car Body Outline */}
                                <motion.path
                                    d="M50 140 L40 130 L40 100 L100 60 L280 60 L350 100 L360 130 L350 140 Z"
                                    stroke="currentColor"
                                    className="text-primary"
                                    strokeWidth="1.5"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                />
                                {/* Windshield */}
                                <motion.path
                                    d="M120 70 L260 70 L300 100 L110 100 Z"
                                    stroke="currentColor"
                                    className="text-primary"
                                    strokeWidth="1"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "linear" }}
                                />
                                {/* Wheels */}
                                <motion.circle cx="100" cy="140" r="25" stroke="currentColor" className="text-primary" strokeWidth="2" />
                                <motion.circle cx="100" cy="140" r="10" stroke="currentColor" className="text-primary" strokeWidth="1" />
                                <motion.circle
                                    cx="100" cy="140" r="18"
                                    stroke="currentColor"
                                    className="text-primary"
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                />

                                <motion.circle cx="300" cy="140" r="25" stroke="currentColor" className="text-primary" strokeWidth="2" />
                                <motion.circle cx="300" cy="140" r="10" stroke="currentColor" className="text-primary" strokeWidth="1" />
                                <motion.circle
                                    cx="300" cy="140" r="18"
                                    stroke="currentColor"
                                    className="text-primary"
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                />

                                {/* Side Detail Lines */}
                                <motion.path d="M100 115 L300 115" stroke="currentColor" className="text-primary" strokeWidth="0.5" opacity="0.5" />
                                <motion.path d="M150 140 L250 140" stroke="currentColor" className="text-primary" strokeWidth="2" strokeDasharray="10 5" />

                                {/* Glow Effect */}
                                <defs>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                            </motion.svg>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50, rotateX: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 200 }}
                        className="bg-card/40 backdrop-blur-2xl border border-white/10 w-full max-w-lg max-h-[90vh] flex flex-col rounded-[44px] shadow-[0_0_100px_-20px_rgba(59,130,246,0.3)] relative z-10 overflow-hidden"
                    >
                        {/* Header - Minimal */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="pt-6 px-6 flex flex-col items-center text-center"
                        >
                            <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary/40">Neural Sync 4.0</h2>
                        </motion.div>

                        {/* Content - Compact (No Scroll) */}
                        <div className="flex-1 p-6 pt-2 space-y-6 overflow-hidden">
                            {/* Avatar & Main Actions */}
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                                }}
                                className="flex flex-col items-center space-y-6"
                            >
                                <div className="flex items-center justify-center gap-6 md:gap-10 w-full px-2 relative">
                                    {/* Neural Aura Glow */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-40 h-40 bg-primary/20 rounded-full blur-[50px] animate-pulse" />
                                    </div>

                                    {/* Abort Button (X) */}
                                    <motion.button
                                        variants={{ hidden: { scale: 0 }, visible: { scale: 1 } }}
                                        whileHover={{ scale: 1.1, rotate: -90, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={onClose}
                                        className="relative p-4 bg-white/5 text-muted-foreground hover:text-red-500 rounded-full border border-white/5 transition-colors duration-300 shadow-xl group z-10"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>

                                    {/* Avatar */}
                                    <motion.div
                                        variants={{ hidden: { scale: 0.5, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
                                        className="relative group z-10"
                                    >
                                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary/30 bg-secondary relative shadow-2xl transition-transform duration-500 group-hover:scale-105">
                                            {image ? (
                                                <Image src={image} alt="Preview" fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-primary text-4xl font-black">
                                                    {name?.[0] || "?"}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                <Camera className="w-6 h-6 text-white animate-bounce" />
                                            </div>
                                        </div>
                                        {/* Orbiting Ring */}
                                        <div className="absolute -inset-2 rounded-full border border-primary/20 animate-[spin_10s_linear_infinite]" />
                                    </motion.div>

                                    {/* Save Button (Tick) */}
                                    <motion.button
                                        variants={{ hidden: { scale: 0 }, visible: { scale: 1 } }}
                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className={`relative p-4 rounded-full border transition-all duration-300 shadow-xl flex items-center justify-center z-10 group ${isSaving
                                            ? "bg-primary/20 border-primary/20 text-primary"
                                            : "bg-primary/10 hover:bg-primary border-primary/20 hover:border-primary text-primary hover:text-white"
                                            }`}
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Check className="w-5 h-5" />
                                        )}
                                        {!isSaving && <div className="absolute -inset-1 rounded-full border border-primary/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 animate-pulse" />}
                                    </motion.button>
                                </div>

                                {/* Form Fields - Static Compact */}
                                <div className="w-full space-y-4 px-4">
                                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-primary/60 text-center block">Avatar Frequency</label>
                                        <input
                                            type="text"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium text-center text-primary"
                                        />
                                    </motion.div>

                                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-primary/60 text-center block">Identity Tag</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your name..."
                                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-black text-center tracking-tighter"
                                        />
                                    </motion.div>

                                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-1 pb-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-primary/60 text-center block">Bio Transmission</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Tell the grid..."
                                            rows={3}
                                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium resize-none text-foreground text-center"
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
