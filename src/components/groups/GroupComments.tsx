"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { getGroupPostComments, createGroupPostComment } from "@/lib/actions/group-actions";
import { toast } from "sonner";

interface GroupCommentsProps {
    postId: string;
    onCommentAdded?: () => void;
}

export const GroupComments = ({ postId, onCommentAdded }: GroupCommentsProps) => {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadComments = async () => {
        const result = await getGroupPostComments(postId);
        if (result.success && result.data) {
            setComments(result.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const timeout = setTimeout(loadComments, 0);
        return () => clearTimeout(timeout);
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const result = await createGroupPostComment(postId, newComment);

        if (result.success && result.data) {
            setComments(prev => [...prev, result.data]);
            setNewComment("");
            onCommentAdded?.();
            toast.success("Comment added!");
        } else {
            toast.error(result.error || "Failed to add comment");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="mt-4 pt-4 border-t border-border space-y-4">
            {/* Comment List */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-center text-sm text-muted py-2">No comments yet. Be the first to reply!</p>
                ) : (
                    comments.map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start space-x-3"
                        >
                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden shrink-0">
                                {comment.author?.image ? (
                                    <Image
                                        src={comment.author.image}
                                        alt={comment.author.name || "User"}
                                        width={32}
                                        height={32}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                                        {comment.author?.name?.[0] || "?"}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="bg-secondary/50 p-3 rounded-2xl rounded-tl-none">
                                    <div className="font-semibold text-xs mb-1">{comment.author?.name || "Unknown"}</div>
                                    <p className="text-sm">{comment.content}</p>
                                </div>
                                <div className="text-[10px] text-muted mt-1 ml-1">
                                    {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 bg-secondary rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="p-2 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 transition-opacity"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </button>
            </form>
        </div>
    );
};
