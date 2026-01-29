import { CreatePost } from "@/components/feed/CreatePost";
import { InfinitePostList } from "@/components/feed/InfinitePostList";
import { auth } from "@/auth";
import { type Post } from "@/lib/types";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { getPosts } from "@/lib/actions/post-actions";
import { checkDatabase } from "@/lib/diagnostics";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
    const dbStatus = await checkDatabase();
    const hasError = Object.values(dbStatus as Record<string, string>).some(v => typeof v === 'string' && !v.startsWith("OK"));

    const session = await auth();
    const userId = session?.user?.id;

    const { posts: postsWithStatus = [], error: fetchError } = await getPosts();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-2xl mx-auto space-y-8 relative">
            {hasError && (
                <div className="glass-card border-red-500 bg-red-500/10 p-8 space-y-6 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                    <div className="flex items-center space-x-3 text-red-500">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold italic tracking-tight">Database Schema Missing</h2>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                        Connect is connected to Supabase, but the **database tables** are missing.
                        This causes the <code className="text-red-400">Failed to fetch posts</code> error.
                    </p>

                    <div className="space-y-4">
                        <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                            <p className="text-xs font-bold uppercase text-primary mb-2">How to Fix This:</p>
                            <ol className="text-xs space-y-2 list-decimal ml-4 text-muted-foreground">
                                <li>Open your <strong className="text-white">Supabase Dashboard</strong>.</li>
                                <li>Go to the <strong className="text-white">SQL Editor</strong> in the left sidebar.</li>
                                <li>Open the <code className="text-primary">supabase-schema.sql</code> file in your project.</li>
                                <li><strong>COPY EVERYTHING</strong> from that file.</li>
                                <li><strong>PASTE & RUN</strong> it in the Supabase SQL Editor.</li>
                            </ol>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[9px]">
                        {Object.entries(dbStatus).map(([table, status]) => (
                            <div key={table} className="flex justify-between p-2 glass rounded border border-white/5">
                                <span className="text-muted-foreground uppercase">{table}</span>
                                <span className={typeof status === 'string' && status.startsWith("OK") ? "text-green-400" : "text-red-500 font-bold"}>
                                    {String(status).includes("does not exist") ? "⚠️ NOT CREATED" : String(status)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-extrabold tracking-tight">Main Feed</h1>
                <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {["All", "Top", "Following"].map((filter: string, i: number) => (
                        <button
                            key={filter}
                            className={`text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full transition-all whitespace-nowrap ${i === 0 ? "bg-primary text-white" : "glass hover:bg-white/5"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </header>

            <CreatePost />

            <ErrorBoundary>
                <div className="space-y-6">
                    {postsWithStatus.length > 0 ? (
                        <InfinitePostList
                            initialPosts={postsWithStatus as Post[]}
                            initialCursor={postsWithStatus.length === 10 ? postsWithStatus[postsWithStatus.length - 1].id : undefined}
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
