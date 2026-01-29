"use client";

import { useState } from "react";
import { toggleFollow } from "@/lib/actions/user-actions";
import { toast } from "sonner";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

interface FollowButtonProps {
    userId: string;
    initialIsFollowing?: boolean;
    className?: string;
}

export const FollowButton = ({ userId, initialIsFollowing = false, className = "" }: FollowButtonProps) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        // Optimistic update
        setIsFollowing(!isFollowing);

        try {
            const result = await toggleFollow(userId);
            if (result.success) {
                toast.success(result.followed ? "Now following" : "Unfollowed");
                setIsFollowing(!!result.followed);
            } else {
                // Rollback
                setIsFollowing(isFollowing);
                toast.error(result.error || "Failed to update follow status");
            }
        } catch (error) {
            setIsFollowing(isFollowing);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleFollow}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-50 ${isFollowing
                ? "bg-secondary text-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-transparent"
                : "bg-primary text-white hover:bg-primary-hover shadow-sm"
                } ${className}`}
        >
            {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isFollowing ? (
                <>
                    <UserMinus className="w-3.5 h-3.5" />
                    <span>Following</span>
                </>
            ) : (
                <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                </>
            )}
        </button>
    );
};
