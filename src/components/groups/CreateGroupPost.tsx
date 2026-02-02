"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { createGroupPost } from "@/lib/actions/group-actions";
import { toast } from "sonner";

interface CreateGroupPostProps {
    groupId: string;
    onPostCreated?: () => void;
}

export const CreateGroupPost = ({ groupId, onPostCreated }: CreateGroupPostProps) => {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const result = await createGroupPost(groupId, content.trim());

        if (result.success) {
            toast.success("Post created!");
            setContent("");
            onPostCreated?.();
        } else {
            toast.error(result.error || "Failed to create post");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="card-simple p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share something with the group..."
                    className="w-full bg-secondary rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    rows={3}
                    disabled={isSubmitting}
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!content.trim() || isSubmitting}
                        className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? "Posting..." : "Post"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};
