import { CreatePost } from "@/components/feed/CreatePost";
import { InfinitePostList } from "@/components/feed/InfinitePostList";
import { auth } from "@/auth";
import { type Post } from "@/lib/types";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { getPosts } from "@/lib/actions/post-actions";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";


export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{ filter?: string }>;
}

export default async function FeedPage({ searchParams }: PageProps) {
    const { filter = "all" } = await searchParams;

    const session = await auth();
    const userId = session?.user?.id;

    const { posts: postsWithStatus = [], error: fetchError } = await getPosts(undefined, 10, filter);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-2xl mx-auto space-y-8 relative">

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-extrabold tracking-tight">
                    Main Feed
                </h1>
                <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {["all", "top", "following"].map((f) => (
                        <Link
                            key={f}
                            href={`/feed?filter=${f}`}
                            className={`text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full transition-all whitespace-nowrap capitalize ${filter === f ? "bg-primary text-white" : "glass hover:bg-white/5"
                                }`}
                        >
                            {f}
                        </Link>
                    ))}
                </div>
            </header>

            <CreatePost />

            <ErrorBoundary>
                <div className="space-y-6">
                    {postsWithStatus.length > 0 ? (
                        <InfinitePostList
                            key={filter} // Reset list when filter changes
                            initialPosts={postsWithStatus as Post[]}
                            initialCursor={postsWithStatus.length === 10 ? postsWithStatus[postsWithStatus.length - 1].id : undefined}
                            filter={filter}
                        />
                    ) : (
                        <div className="text-center py-20 glass-card">
                            <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                        </div>
                    )}
                </div>
            </ErrorBoundary>
        </div>
    );
}
