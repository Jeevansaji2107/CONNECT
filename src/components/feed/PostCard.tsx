"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MoreHorizontal, MessageSquare, Share2, Heart, Trash2, Bookmark, Eye, EyeOff, Lock, Smile, Check, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { FollowButton } from "@/components/shared/FollowButton";
import { likePost, unlikePost, deletePost, createComment, getComments, reactToPost, toggleBookmark } from "@/lib/actions/post-actions";
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
        visibility?: "public" | "followers" | "private";
        isBookmarkedInitial?: boolean;
    };
    isFollowingAuthorInitial?: boolean;
    className?: string;
}

export const PostCard = ({ post, isFollowingAuthorInitial = false, className = "" }: PostCardProps) => {
    const { data: session } = useSession();

    const { id, content, image, createdAt, author, authorId } = post || {};
    const authorName = (author?.email?.toLowerCase() === "maddy@connect.social" || author?.name === "Nexus Explorer" || !author?.name) ? "Maddy" : (author?.email?.toLowerCase().includes("jeevansaji2107")) ? "JEEVAN SAJI" : author.name;
    const isOwner = session?.user?.id === authorId;

    // Use user_id from the database schema
    const [isLiked, setIsLiked] = useState(post?.likes?.some(l => l.user_id === session?.user?.id) ?? false);
    const [likesCount, setLikesCount] = useState(post?._count?.likes || 0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(post?.isBookmarkedInitial ?? false);
    const [showReactions, setShowReactions] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [burstEmoji, setBurstEmoji] = useState("");
    const [isBurstActive, setIsBurstActive] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const reactions = ["❤️", "🔥", "🚀", "💎", "👾", "👀"];

    // Sync isLiked when session changes
    useEffect(() => {
        setIsMounted(true);
        if (post?.likes) {
            setIsLiked(post.likes.some(l => l.user_id === session?.user?.id));
        }
    }, [session?.user?.id, post?.likes]);

    // Safety check for post data
    if (!post || !post.author) {
        return null;
    }

    const handleReaction = async (emoji: string) => {
        if (!session) return toast.error("Please sign in to react");
        setShowReactions(false);
        try {
            const result = await reactToPost(id, emoji);
            if (result.success) {
                toast.success("Reaction Synchronized");
                if (!isLiked) {
                    setIsLiked(true);
                    setLikesCount(prev => prev + 1);
                }
                setBurstEmoji(emoji);
                setIsBurstActive(true);
            }
        } catch (error) {
            toast.error("Reaction failed");
        }
    };

    const handleBookmark = async () => {
        if (!session) return toast.error("Please sign in to save posts");
        const current = isBookmarked;
        setIsBookmarked(!current);
        try {
            const result = await toggleBookmark(id);
            if (result.success) {
                toast.success(result.bookmarked ? "Archived to Vault" : "Removed from Vault");
            } else {
                setIsBookmarked(current);
            }
        } catch (error) {
            setIsBookmarked(current);
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
            const result = await createComment(id, commentText, replyTo || undefined);
            if (result.success) {
                setCommentText("");
                setReplyTo(null);
                toast.success(replyTo ? "Reply Synchronized" : "Transmission Dispatched");
                fetchComments();
            } else {
                toast.error(result.error || "Uplink failed");
            }
        } catch (error) {
            toast.error("System interruption");
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
            className={`group/card card-simple p-6 ${className} relative overflow-hidden`}
        >
            {/* Spotlight Gradient */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-0"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.08), transparent 40%)`
                }}
            />
            <div className="space-y-5 relative z-10">
                {/* Author Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link href={`/profile/${author.id}`} className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary border border-border">
                                {author.email?.toLowerCase() === "maddy@connect.social" ? (
                                    <Image src="https://i.pinimg.com/736x/13/f4/ed/13f4ed13e9d297b674b36cff7f8e273f.jpg" alt={authorName} fill className="object-cover" />
                                ) : (author.email?.toLowerCase().includes("jeevansaji2107")) ? (
                                    <Image
                                        src={(author.image?.includes("13f4ed13e9d297b674b36cff7f8e273f") || !author.image)
                                            ? "https://i.pinimg.com/736x/a3/27/bf/a327bf02ee0174a438746cc99a1c9e15.jpg"
                                            : author.image}
                                        alt={authorName}
                                        fill
                                        className="object-cover"
                                    />
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
                                <Link href={`/profile/${author.id}`} className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1">
                                    {authorName}
                                    {(author.email === "maddy@connect.social" || author.email === "jeevansaji2107@gmail.com") && (
                                        <Check className="w-3 h-3 text-primary fill-primary/10" strokeWidth={3} />
                                    )}
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

                    <div className="flex items-center space-x-3">
                        {post.visibility && post.visibility !== "public" && (
                            <div className="flex items-center space-x-1.5 bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20 text-[9px] font-black uppercase tracking-tighter">
                                {post.visibility === "private" ? <Lock className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                                <span>{post.visibility}</span>
                            </div>
                        )}
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
                <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <button
                                onClick={() => handleReaction("like")}
                                onMouseEnter={() => setShowReactions(true)}
                                className={`flex items-center space-x-2 transition-all ${isLiked ? "text-red-500" : "text-muted hover:text-red-500"}`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                                <span className="text-xs font-semibold">{likesCount}</span>
                            </button>

                            <AnimatePresence>
                                {showReactions && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: -45, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                        onMouseLeave={() => setShowReactions(false)}
                                        className="absolute left-0 bottom-full mb-2 bg-card border border-border rounded-full p-1.5 shadow-2xl flex items-center space-x-2 z-50 whitespace-nowrap"
                                    >
                                        {reactions.map((emoji) => (
                                            <button
                                                key={emoji}
                                                onClick={() => handleReaction(emoji)}
                                                className="hover:scale-125 transition-transform p-1.5 text-lg"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

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

                    <button
                        onClick={handleBookmark}
                        className={`p-2 transition-all ${isBookmarked ? "text-yellow-500" : "text-muted hover:text-foreground"}`}
                    >
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
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
                                            id={`comment-input-${post.id}`}
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder={replyTo ? "Type your reply..." : "Add a comment..."}
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
                                    {comments.filter(c => !c.parentId).map((comment: Comment) => (
                                        <CommentItem
                                            key={comment.id}
                                            comment={comment}
                                            allComments={comments}
                                            onReply={(id) => {
                                                setReplyTo(id);
                                                const input = document.getElementById(`comment-input-${post.id}`);
                                                input?.focus();
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const CommentItem = ({ comment, allComments, onReply, level = 0 }: { comment: Comment, allComments: Comment[], onReply: (id: string) => void, level?: number }) => {
    const { data: session } = useSession();
    const replies = allComments.filter(c => c.parentId === comment.id);
    const cName = (comment.author?.email === "maddy@connect.social" || comment.author?.name === "Nexus Explorer" || !comment.author?.name) ? "Maddy" : (comment.author?.email?.includes("jeevansaji2107")) ? "JEEVAN SAJI" : comment.author.name;
    const isCommentOwner = session?.user?.email === comment.author?.email || (comment.author?.email?.includes("jeevansaji2107") && session?.user?.email?.includes("jeevansaji2107"));
    const cImage = comment.author?.email === "maddy@connect.social"
        ? "https://i.pinimg.com/736x/13/f4/ed/13f4ed13e9d297b674b36cff7f8e273f.jpg"
        : (comment.author?.email?.includes("jeevansaji2107"))
            ? ((comment.author?.image?.includes("13f4ed13e9d297b674b36cff7f8e273f") || !comment.author?.image)
                ? "https://i.pinimg.com/736x/a3/27/bf/a327bf02ee0174a438746cc99a1c9e15.jpg"
                : comment.author?.image)
            : comment.author?.image;

    return (
        <div className={`space-y-4 ${level > 0 ? "ml-8 border-l border-border/30 pl-4" : ""}`}>
            <div className="flex space-x-3 group/comment">
                <div className="relative w-8 h-8 rounded-full bg-secondary overflow-hidden shrink-0 border border-white/5">
                    {cImage ? (
                        <Image src={cImage} alt="" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">
                            {cName[0] || "?"}
                        </div>
                    )}
                </div>
                <div className="flex-1 space-y-1">
                    <div className="bg-secondary/30 rounded-2xl p-3 border border-border/5 group-hover/comment:border-primary/20 transition-all">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-foreground/90 flex items-center gap-1">
                                {cName}
                                {(comment.author?.email === "maddy@connect.social" || comment.author?.email === "jeevansaji2107@gmail.com") && (
                                    <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
                                )}
                            </span>
                            <span className="text-[10px] text-muted">
                                {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt)) + " ago" : "Just now"}
                            </span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">{comment.content}</p>
                    </div>
                    <button
                        onClick={() => onReply(comment.id)}
                        className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors ml-2"
                    >
                        Reply
                    </button>
                </div>
            </div>
            {replies.length > 0 && (
                <div className="space-y-4">
                    {replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} allComments={allComments} onReply={onReply} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

