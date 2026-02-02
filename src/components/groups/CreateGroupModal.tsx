"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Lock, Globe } from "lucide-react";
import { createGroup } from "@/lib/actions/group-actions";
import { toast } from "sonner";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateGroupModal = ({ isOpen, onClose, onSuccess }: CreateGroupModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState<"public" | "private">("public");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Group name is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createGroup(name, description, visibility);
            if (result.success) {
                toast.success("Group created successfully!");
                setName("");
                setDescription("");
                setVisibility("public");
                onClose();
                onSuccess?.();
            } else {
                toast.error(result.error || "Failed to create group");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
                    >
                        <div className="card-simple p-8 mx-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Create Group</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Group Name */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Group Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter group name..."
                                        className="glass-input w-full"
                                        maxLength={100}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="What's this group about?"
                                        className="glass-input w-full min-h-[100px] resize-none"
                                        maxLength={500}
                                    />
                                </div>

                                {/* Visibility */}
                                <div>
                                    <label className="block text-sm font-semibold mb-3">
                                        Visibility
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setVisibility("public")}
                                            className={`p-4 rounded-xl border-2 transition-all ${visibility === "public"
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <Globe className="w-5 h-5 mx-auto mb-2" />
                                            <div className="text-sm font-bold">Public</div>
                                            <div className="text-xs text-muted mt-1">
                                                Anyone can join
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setVisibility("private")}
                                            className={`p-4 rounded-xl border-2 transition-all ${visibility === "private"
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <Lock className="w-5 h-5 mx-auto mb-2" />
                                            <div className="text-sm font-bold">Private</div>
                                            <div className="text-xs text-muted mt-1">
                                                Invite only
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="btn-outline flex-1"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary flex-1"
                                        disabled={isSubmitting || !name.trim()}
                                    >
                                        {isSubmitting ? "Creating..." : "Create Group"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
