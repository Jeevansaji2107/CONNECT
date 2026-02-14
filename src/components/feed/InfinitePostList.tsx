"use client";

import { useState, useEffect, useCallback } from "react";
import { PostCard } from "./PostCard";
import { Post } from "@/lib/types";
import { getPosts } from "@/lib/actions/post-actions";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/store";
import { PostModal } from "./PostModal";

interface InfinitePostListProps {
    initialPosts: Post[];
    initialCursor?: string;
    filter?: string;
}

export const InfinitePostList = ({ initialPosts, initialCursor, filter = "all" }: InfinitePostListProps) => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [cursor, setCursor] = useState<string | undefined>(initialCursor);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(!!initialCursor);

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: "200px",
    });

    const loadMorePosts = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const result = await getPosts(cursor, 10, filter);
            if (result.success && result.posts) {
                setPosts((prev) => [...prev, ...(result.posts as Post[])]);
                setCursor(result.nextCursor);
                setHasMore(!!result.nextCursor);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load more posts:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [cursor, isLoading, hasMore, filter]);

    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            loadMorePosts();
        }
    }, [inView, hasMore, isLoading, loadMorePosts]);

    const expandedPostId = useUIStore((state) => state.expandedPostId);
    const setExpandedPostId = useUIStore((state) => state.setExpandedPostId);
    const expandedPost = posts.find(p => p.id === expandedPostId);

    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
                className="space-y-6"
            >
                {/* ... existing map ... */}
                {posts.map((post) => (
                    <motion.div
                        key={post.id}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <PostCard
                            post={post}
                            isFollowingAuthorInitial={post.isFollowingAuthorInitial}
                        />
                    </motion.div>
                ))}

                {hasMore && (
                    <div ref={ref} className="flex justify-center py-8">
                        {isLoading && (
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        )}
                    </div>
                )}

                {!hasMore && posts.length > 0 && (
                    <p className="text-center text-muted-foreground text-sm py-8">
                        You&apos;ve reached the end of the Connect stream.
                    </p>
                )}
            </motion.div>

            <AnimatePresence>
                {expandedPost && (
                    <PostModal
                        post={expandedPost}
                        onClose={() => setExpandedPostId(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
