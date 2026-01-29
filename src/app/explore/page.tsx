import { TrendingUp, UserPlus, Zap } from "lucide-react";
import { getTrendingPosts } from "@/lib/actions/post-actions";
import { getSuggestedUsers } from "@/lib/actions/user-actions";
import { PostCard } from "@/components/feed/PostCard";
import Image from "next/image";
import { SearchInput } from "@/components/explore/SearchInput";
import { FollowButton } from "@/components/shared/FollowButton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Post, User } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
    const trendingResult = await getTrendingPosts(3);
    const suggestedResult = await getSuggestedUsers(3);

    const trendingPosts = (trendingResult.success && trendingResult.posts) ? trendingResult.posts : [];
    const suggestedUsers = (suggestedResult.success && suggestedResult.users) ? suggestedResult.users : [];

    return (
        <div className="space-y-12">
            <div className="max-w-2xl mx-auto">
                <SearchInput />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
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
                </div>

                <div className="space-y-10">
                    <section className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <UserPlus className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold tracking-tight">Who to Follow</h2>
                        </div>

                        <div className="card-simple divide-y divide-border overflow-hidden">
                            {suggestedUsers.length > 0 ? (
                                suggestedUsers.map((user: { id: string, name: string | null, image: string | null, _count: { followers: number } }) => (
                                    <div key={user.id} className="p-5 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative w-12 h-12 rounded-full bg-secondary overflow-hidden border border-border">
                                                {user.image ? (
                                                    <Image src={user.image} alt={user.name || ""} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-bold text-primary">
                                                        {user.name?.[0] || "?"}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-foreground">{user.name}</span>
                                                <span className="text-[10px] text-muted font-medium uppercase tracking-wider">{user._count.followers} followers</span>
                                            </div>
                                        </div>
                                        <FollowButton userId={user.id} />
                                    </div>
                                ))
                            ) : (
                                <p className="p-6 text-xs text-muted font-medium text-center">No suggestions today.</p>
                            )}
                        </div>
                    </section>

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
                </div>
            </div>
        </div>
    );
}
