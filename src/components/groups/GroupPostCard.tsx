"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, MoreVertical, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { likeGroupPost, deleteGroupPost } from "@/lib/actions/group-actions";
import { toast } from "sonner";
import { GroupComments } from "./GroupComments";

interface GroupPostCardProps {
    post: any;
    memberRole?: string;
}

export const GroupPostCard = ({ post, memberRole }: GroupPostCardProps) => {
    const [isLiked, setIsLiked] = useState(post.isLiked || false);
    const [likeCount, setLikeCount] = useState(post._count?.likes || 0);
    const [isLiking, setIsLiking] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(post._count?.comments || 0);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);

        const result = await likeGroupPost(post.id);
        if (result.success) {
            setIsLiked(result.liked);
            setLikeCount((prev: number) => result.liked ? prev + 1 : prev - 1);
        } else {
            toast.error("Failed to like post");
        }
        setIsLiking(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        setIsDeleting(true);
        const result = await deleteGroupPost(post.id);
        if (result.success) {
            toast.success("Post deleted");
            // The parent component should ideally handle the removal from state, 
            // but for now, we'll let revalidatePath handle it or just hide it.
            // A more robust way would be a callback to GroupFeed.
        } else {
            toast.error(result.error || "Failed to delete post");
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-simple p-6"
        >
            {/* Author */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                        {post.author?.image ? (
                            <Image
                                src={post.author.image}
                                alt={post.author.name || "User"}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-bold">
                                {post.author?.name?.[0] || "?"}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-semibold">{post.author?.name || "Unknown"}</div>
                        <div className="text-xs text-muted">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Add delete option for auth/admin */}
                    {(post.author?.id === post.currentUserId || ["owner", "admin", "moderator"].includes(memberRole || "")) && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2 hover:bg-red-500/10 text-muted hover:text-red-500 rounded-full transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                    <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <MoreVertical className="w-4 h-4 text-muted" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

            {/* Image */}
            {post.image && (
                <div className="mb-4 rounded-xl overflow-hidden">
                    <Image
                        src={post.image}
                        alt="Post image"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-6 pt-4 border-t border-border">
                <button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`flex items-center space-x-2 transition-colors ${isLiked ? "text-red-500" : "text-muted hover:text-foreground"
                        }`}
                >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                    <span className="text-sm font-medium">{likeCount}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className={`flex items-center space-x-2 transition-colors ${showComments ? "text-primary" : "text-muted hover:text-foreground"}`}
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{commentCount}</span>
                </button>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <GroupComments
                            postId={post.id}
                            onCommentAdded={() => setCommentCount((prev: number) => prev + 1)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
