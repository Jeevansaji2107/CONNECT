"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MoreHorizontal, MessageSquare, Share2, Heart, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { FollowButton } from "@/components/shared/FollowButton";
import { likePost, unlikePost, deletePost, createComment, getComments } from "@/lib/actions/post-actions";
import { Comment } from "@/lib/types";

interface PostCardProps {
    post: {
        id: string;
        content: string;
        image?: string | null;
        createdAt: string;
        authorId: string;
        author: {
            id: string;
            name: string | null;
            email: string | null;
            image: string | null;
        };
        likes: { user_id: string }[];
        _count: {
            likes: number;
            comments: number;
        };
    };
    isFollowingAuthorInitial?: boolean;
    className?: string;
}

export const PostCard = ({ post, isFollowingAuthorInitial = false, className = "" }: PostCardProps) => {
    const { data: session } = useSession();

    const { id, content, image, createdAt, author, authorId } = post || {};
    const authorName = (author?.name === "Nexus Explorer" || !author?.name) ? "Connect Member" : author.name;
    const isOwner = session?.user?.id === authorId;

    // Use user_id from the database schema
    const [isLiked, setIsLiked] = useState(post?.likes?.some(l => l.user_id === session?.user?.id) ?? false);
    const [likesCount, setLikesCount] = useState(post?._count?.likes || 0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Sync isLiked when session changes
    useEffect(() => {
        if (post?.likes) {
            setIsLiked(post.likes.some(l => l.user_id === session?.user?.id));
        }
    }, [session?.user?.id, post?.likes]);

    // Safety check for post data
    if (!post || !post.author) {
        return null;
    }

    const handleLike = async () => {
        if (!session) return toast.error("Please sign in to like posts");
        const currentLiked = isLiked;
        // Optimistic update
        setIsLiked(!currentLiked);
        setLikesCount(prev => currentLiked ? Math.max(0, prev - 1) : prev + 1);

        try {
            const result = currentLiked ? await unlikePost(id) : await likePost(id);
            if (!result.success) {
                // Rollback
                setIsLiked(currentLiked);
                setLikesCount(prev => currentLiked ? prev + 1 : prev - 1);
                toast.error("Failed to update like");
            }
        } catch (error) {
            setIsLiked(currentLiked);
            setLikesCount(prev => currentLiked ? prev + 1 : prev - 1);
            toast.error("Failed to update like");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        setIsDeleting(true);
        try {
            const result = await deletePost(id);
            if (result.success) {
                toast.success("Post deleted");
            } else {
                toast.error(result.error || "Failed to delete post");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the post");
        } finally {
            setIsDeleting(false);
        }
    };

    const fetchComments = async () => {
        const result = await getComments(id);
        if (result.success) setComments(result.data || []);
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setIsCommenting(true);
        try {
            const result = await createComment(id, commentText);
            if (result.success) {
                setCommentText("");
                toast.success("Comment added!");
                fetchComments();
            } else {
                toast.error(result.error || "Failed to add comment");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsCommenting(false);
        }
    };

    // Safe date formatting
    const timeAgo = () => {
        try {
            return formatDistanceToNow(new Date(createdAt)) + " ago";
        } catch (e) {
            return "Just now";
        }
    };

    // Moved hook up

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                mass: 1
            }}
            onMouseMove={handleMouseMove}
            className={`group/card card-simple p-6 ${className} relative`}
        >
            {/* Spotlight Gradient */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-0"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.08), transparent 40%)`
                }}
            />
            <div className="space-y-5">
                {/* Author Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link href={`/profile/${author.id}`} className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary border border-border">
                                {author.email === "maddy@connect.social" ? (
                                    <Image src="/avatars/maddy.png" alt={authorName} fill className="object-cover" />
                                ) : author.image ? (
                                    <Image src={author.image} alt={authorName} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                                        {authorName?.[0] || "?"}
                                    </div>
                                )}
                            </div>
                        </Link>
                        <div>
                            <div className="flex items-center space-x-2">
                                <Link href={`/profile/${author.id}`} className="font-bold text-foreground hover:text-primary transition-colors">
                                    {authorName}
                                </Link>
                                {!isOwner && (
                                    <FollowButton
                                        userId={author.id}
                                        initialIsFollowing={isFollowingAuthorInitial}
                                        className="scale-75 origin-left"
                                    />
                                )}
                            </div>
                            <p className="text-xs text-muted">
                                {timeAgo()}
                            </p>
                        </div>
                    </div>

                    {isOwner ? (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-full transition-all"
                        >
                            <Trash2 className="w-4.5 h-4.5" />
                        </button>
                    ) : (
                        <button className="p-2 text-muted hover:text-foreground hover:bg-secondary rounded-full transition-all">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="text-[15px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {content}
                </div>

                {/* Media */}
                {image && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-secondary">
                        <Image src={image} alt="Post image" fill className="object-cover" />
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-6 pt-2 border-t border-border">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 transition-all ${isLiked ? "text-red-500" : "text-muted hover:text-red-500"}`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                        <span className="text-xs font-semibold">{likesCount}</span>
                    </button>

                    <button
                        onClick={() => {
                            setShowComments(!showComments);
                            if (!showComments) fetchComments();
                        }}
                        className="flex items-center space-x-2 text-muted hover:text-primary transition-all"
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-xs font-semibold">{post._count?.comments || 0}</span>
                    </button>

                    <button className="flex items-center space-x-2 text-muted hover:text-primary transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 space-y-4">
                                <form onSubmit={handleComment} className="flex items-center space-x-3">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="input-google w-full"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isCommenting || !commentText.trim()}
                                        className="btn-primary py-1.5 px-4 text-xs"
                                    >
                                        Post
                                    </button>
                                </form>

                                <div className="space-y-4">
                                    {comments.map((comment: Comment) => {
                                        const cName = (comment.author?.name === "Nexus Explorer" || !comment.author?.name) ? "Connect Member" : comment.author.name;
                                        const cImage = comment.author?.email === "maddy@connect.social" ? "/avatars/maddy.png" : comment.author?.image;
                                        return (
                                            <div key={comment.id} className="flex space-x-3">
                                                <div className="relative w-8 h-8 rounded-full bg-secondary overflow-hidden shrink-0">
                                                    {cImage ? (
                                                        <Image src={cImage} alt="" fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">
                                                            {cName[0] || "?"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 bg-secondary/50 rounded-2xl p-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-bold text-xs">{cName}</span>
                                                        <span className="text-[10px] text-muted">
                                                            {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt)) + " ago" : "Just now"}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground/80">{comment.content}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
