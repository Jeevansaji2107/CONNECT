import { TrendingUp, UserPlus, Zap, Search as SearchIcon } from "lucide-react";
import { getTrendingPosts, searchPosts } from "@/lib/actions/post-actions";
import { getSuggestedUsers, searchUsers } from "@/lib/actions/user-actions";
import { PostCard } from "@/components/feed/PostCard";
import Image from "next/image";
import { SearchInput } from "@/components/explore/SearchInput";
import { FollowButton } from "@/components/shared/FollowButton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Post, User } from "@/lib/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const isSearching = !!q;

    let trendingPosts: Post[] = [];
    let suggestedUsers: any[] = [];
    let searchUserResults: any[] = [];
    let searchPostResults: Post[] = [];

    if (isSearching) {
        const userRes = await searchUsers(q!);
        const postRes = await searchPosts(q!);
        if (userRes.success && userRes.users) searchUserResults = userRes.users;
        if (postRes.success && postRes.posts) searchPostResults = postRes.posts;
    } else {
        const trendingResult = await getTrendingPosts(10);
        const suggestedResult = await getSuggestedUsers(12);
        if (trendingResult.success && trendingResult.posts) trendingPosts = trendingResult.posts as Post[];
        if (suggestedResult.success && suggestedResult.users) suggestedUsers = suggestedResult.users as any[];

        // Demo Fallback
        if (suggestedUsers.length === 0) {
            suggestedUsers = [
                { id: "liam-1", name: "Liam Chen", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam", followers: { count: 1200 } },
                { id: "sofia-2", name: "Sofia Rodriguez", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia", followers: { count: 850 } },
                { id: "marcus-3", name: "Marcus Thorne", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", followers: { count: 2400 } },
                { id: "elena-4", name: "Elena Petrov", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena", followers: { count: 1100 } },
            ].map(u => ({ ...u, _count: { followers: u.followers.count } }));
        }
    }

    return (
        <div className="space-y-12 max-w-[1400px] mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto space-y-4">
                <SearchInput />
                {isSearching && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted">Results for</span>
                        <span className="font-bold text-primary">&quot;{q}&quot;</span>
                        <Link href="/explore" className="ml-auto text-[10px] uppercase font-bold tracking-widest text-muted hover:text-foreground">Clear Search</Link>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                    {isSearching ? (
                        <section className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <SearchIcon className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold tracking-tight uppercase">Transmissions Found</h2>
                            </div>
                            <div className="space-y-6">
                                {searchPostResults.length > 0 ? (
                                    searchPostResults.map((post) => (
                                        <PostCard key={post.id} post={post} />
                                    ))
                                ) : (
                                    <div className="card-simple p-12 text-center text-muted border-dashed uppercase text-[10px] font-bold tracking-widest">
                                        No transmissions matching that frequency.
                                    </div>
                                )}
                            </div>
                        </section>
                    ) : (
                        <section className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <TrendingUp className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold tracking-tight">Trending Now</h2>
                            </div>

                            <div className="space-y-6">
                                {trendingPosts.length > 0 ? (
                                    trendingPosts.map((post: Post) => (
                                        <PostCard key={post.id} post={post} />
                                    ))
                                ) : (
                                    <div className="card-simple p-12 text-center text-muted border-dashed">
                                        No trending posts yet. Share something amazing!
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-10">
                    <section className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <UserPlus className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold tracking-tight uppercase">{isSearching ? "Nodes Identified" : "Who to Follow"}</h2>
                        </div>

                        <div className="card-simple divide-y divide-border overflow-hidden">
                            {(isSearching ? searchUserResults : suggestedUsers).length > 0 ? (
                                (isSearching ? searchUserResults : suggestedUsers).map((user: any) => (
                                    <div key={user.id} className="p-5 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                                        <Link href={`/profile/${user.id}`} className="flex items-center space-x-3 group">
                                            <div className="relative w-12 h-12 rounded-full bg-secondary overflow-hidden border border-border transition-transform group-hover:scale-105">
                                                {user.image ? (
                                                    <Image src={user.image} alt={user.name || ""} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-bold text-primary">
                                                        {user.name?.[0] || "?"}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{user.name}</span>
                                                <span className="text-[10px] text-muted font-medium uppercase tracking-wider">{user._count.followers} followers</span>
                                            </div>
                                        </Link>
                                        <FollowButton userId={user.id} />
                                    </div>
                                ))
                            ) : (
                                <p className="p-6 text-[10px] font-bold text-muted uppercase tracking-widest text-center">No nodes detected.</p>
                            )}
                        </div>
                    </section>

                    {!isSearching && (
                        <section className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <Zap className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold tracking-tight">Connect Analytics</h2>
                            </div>

                            <div className="card-simple p-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-muted uppercase tracking-wider">Global Sentiment</span>
                                        <span className="text-primary">Optimistic</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full w-[85%] bg-primary rounded-full" />
                                    </div>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <p className="text-xs leading-relaxed text-muted font-medium italic">
                                        &quot;Connect is currently seeing a 15% increase in meaningful connections today.&quot;
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
