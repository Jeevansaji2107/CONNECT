"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    author: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

interface CommentSectionProps {
    postId: string;
    initialComments?: Comment[];
}

export const CommentSection = ({ postId, initialComments = [] }: CommentSectionProps) => {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId, content: newComment }),
            });

            if (!res.ok) throw new Error("Failed to post comment");

            const data = await res.json();
            setComments(prev => [data.comment, ...prev]);
            setNewComment("");
            toast.success("Comment posted!");
        } catch (error) {
            toast.error("Failed to post comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Comment Input */}
            {session && (
                <form onSubmit={handleSubmit} className="flex space-x-3">
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 overflow-hidden shrink-0">
                        {session.user?.image ? (
                            <Image src={session.user.image} alt="" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                {session.user?.name?.[0] || "U"}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 flex space-x-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 glass-input text-sm"
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || isSubmitting}
                            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            )}

            {/* Comments List */}
            <AnimatePresence>
                {comments.length > 0 ? (
                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex space-x-3"
                            >
                                <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 overflow-hidden shrink-0">
                                    {comment.author.image ? (
                                        <Image src={comment.author.image} alt="" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                            {comment.author.name?.[0] || "U"}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 glass-card p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-sm">{comment.author.name || "Anonymous"}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm">{comment.content}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">No comments yet. Be the first!</p>
                )}
            </AnimatePresence>
        </div>
    );
};
