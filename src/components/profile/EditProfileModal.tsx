"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentName: string | null;
    currentBio: string | null;
    currentImage: string | null;
}

export const EditProfileModal = ({ isOpen, onClose, currentName, currentBio, currentImage }: EditProfileModalProps) => {
    const { data: session, update } = useSession();
    const [name, setName] = useState(currentName || "");
    const [bio, setBio] = useState(currentBio || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, bio }),
            });

            if (!res.ok) throw new Error("Failed to update profile");

            await update(); // Refresh session
            toast.success("Profile updated successfully!");
            onClose();
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative glass-card p-6 w-full max-w-md space-y-6"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Edit Profile</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Avatar Preview */}
                    <div className="flex justify-center">
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-1">
                            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                {currentImage ? (
                                    <Image src={currentImage} alt="" fill className="object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold">{name?.[0] || "U"}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full glass-input"
                                placeholder="Your name"
                                maxLength={50}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">
                                Bio
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full glass-input min-h-[100px] resize-none"
                                placeholder="Tell us about yourself..."
                                maxLength={160}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {bio.length}/160
                            </p>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 glass-card py-3 rounded-xl font-medium hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
