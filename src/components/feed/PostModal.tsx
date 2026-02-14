"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageSquare, Repeat2, Bookmark, Share2 } from "lucide-react";
import { useUIStore } from "@/lib/store";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Post } from "@/lib/types";
import { useEffect, useState } from "react";

interface PostModalProps {
    post: Post;
    onClose: () => void;
}

export const PostModal = ({ post, onClose }: PostModalProps) => {
    // Lock scroll when open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const authorName = (post.author?.email?.toLowerCase() === "maddy@connect.social" || post.author?.name === "Nexus Explorer" || !post.author?.name) ? "Maddy" : (post.author?.email?.toLowerCase().includes("jeevansaji2107")) ? "JEEVAN SAJI" : post.author.name;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
        >
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/90 backdrop-blur-xl"
            />

            {/* Modal Content */}
            <motion.div
                layoutId={`post-card-${post.id}`}
                className="relative w-full max-w-4xl bg-card border border-border rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[85vh] z-10"
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-background/50 backdrop-blur-md border border-border hover:bg-white/10 transition-all z-20"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* Left side: Media (if exists) */}
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                    <div className="md:w-3/5 bg-black/40 flex items-center justify-center relative border-r border-border min-h-[300px] md:min-h-full">
                        <Image
                            src={post.mediaUrls[0]}
                            alt="Post media"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                )}

                {/* Right side: Content */}
                <div className={`flex flex-col flex-1 min-w-0 bg-card/50 ${(!post.mediaUrls || post.mediaUrls.length === 0) ? "w-full" : "md:w-2/5"}`}>
                    {/* Header */}
                    <div className="p-6 border-b border-border flex items-center space-x-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-secondary border border-border">
                            {post.author.email?.toLowerCase() === "maddy@connect.social" ? (
                                <Image src="https://i.pinimg.com/736x/13/f4/ed/13f4ed13e9d297b674b36cff7f8e273f.jpg" alt="" fill className="object-cover" />
                            ) : (post.author.email?.toLowerCase().includes("jeevansaji2107")) ? (
                                <Image src={post.author.image || "https://i.pinimg.com/736x/a3/27/bf/a327bf02ee0174a438746cc99a1c9e15.jpg"} alt="" fill className="object-cover" />
                            ) : post.author.image ? (
                                <Image src={post.author.image} alt="" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                                    {authorName[0]}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground leading-tight">{authorName}</h3>
                            <p className="text-xs text-muted">{formatDistanceToNow(new Date(post.createdAt))} ago</p>
                        </div>
                    </div>

                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <div className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap font-medium">
                            {post.content}
                        </div>

                        {/* Stats/Actions */}
                        <div className="flex items-center justify-between pt-6 border-t border-border">
                            <div className="flex items-center space-x-8">
                                <button className="flex items-center space-x-2 text-muted hover:text-red-500 transition-colors">
                                    <Heart className="w-6 h-6" />
                                    <span className="font-bold">{post._count?.likes || 0}</span>
                                </button>
                                <button className="flex items-center space-x-2 text-muted hover:text-primary transition-colors">
                                    <MessageSquare className="w-6 h-6" />
                                    <span className="font-bold">{post._count?.comments || 0}</span>
                                </button>
                                <button className="text-muted hover:text-green-500 transition-colors">
                                    <Repeat2 className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Bookmark className="w-6 h-6 text-muted hover:text-yellow-500 transition-colors cursor-pointer" />
                                <Share2 className="w-6 h-6 text-muted hover:text-primary transition-colors cursor-pointer" />
                            </div>
                        </div>

                        {/* System Metadata Layer */}
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 space-y-2">
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-black text-primary/60">
                                <span>Sequence ID</span>
                                <span>{post.id.slice(0, 8)}...</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-black text-primary/60">
                                <span>Visibility Status</span>
                                <span>{post.visibility || "PUBLIC"}</span>
                            </div>
                            <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, ease: "linear" }}
                                    className="h-full bg-primary/40"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer / Quick Comment Input */}
                    <div className="p-4 bg-background/30 backdrop-blur-md border-t border-border">
                        <div className="glass-input flex items-center px-4 py-2 hover:border-primary/50 transition-all cursor-pointer">
                            <span className="text-muted text-sm">Synchronize response...</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
