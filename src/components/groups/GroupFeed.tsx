"use client";

import { useEffect, useState } from "react";
import { getGroupPosts } from "@/lib/actions/group-actions";
import { GroupPostCard } from "./GroupPostCard";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface GroupFeedProps {
    groupId: string;
    memberRole?: string;
    refreshTrigger?: number;
}

export const GroupFeed = ({ groupId, memberRole, refreshTrigger }: GroupFeedProps) => {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPosts = async () => {
            const result = await getGroupPosts(groupId);

            if (result.success && result.data) {
                setPosts(result.data);
                setError(null);
            } else {
                setError(result.error || "Failed to load posts");
            }
            setIsLoading(false);
        };

        loadPosts();
    }, [groupId, refreshTrigger]);

    if (isLoading) {
        return (
            <div className="card-simple p-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="card-simple p-12 text-center">
                <p className="text-muted">{error}</p>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="card-simple p-12 text-center">
                <p className="text-muted mb-2">No posts yet</p>
                <p className="text-sm text-muted">Be the first to share something!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <GroupPostCard
                    key={post.id}
                    post={{ ...post, currentUserId: session?.user?.id }}
                    memberRole={memberRole}
                />
            ))}
        </div>
    );
};
