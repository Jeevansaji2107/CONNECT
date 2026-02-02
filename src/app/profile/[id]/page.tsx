import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { MapPin, Calendar, Settings, Share2, Grid, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";
import { PostCard } from "@/components/feed/PostCard";
import { FollowButton } from "@/components/shared/FollowButton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export const dynamic = "force-dynamic";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const { id } = await params;
    const currentUserId = session?.user?.id;

    if (currentUserId === id) {
        redirect("/profile");
    }

    // Fetch user details and follow counts
    const { data: user, error: userError } = await supabase
        .from("users")
        .select(`
            *,
            followers:follows!follows_following_id_fkey (count),
            following:follows!follows_follower_id_fkey (count),
            viewer_follow:follows!follows_following_id_fkey (id)
        `)
        .eq("id", id)
        .eq("viewer_follow.follower_id", currentUserId || "")
        .single();

    if (userError || !user) {
        notFound();
    }

    // Fetch user's posts
    const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select(`
            *,
            author:users (id, name, email, image),
            likes (user_id),
            comments (count)
        `)
        .eq("author_id", id)
        .order("created_at", { ascending: false });

    const isFollowing = user.viewer_follow && user.viewer_follow.length > 0;

    // Format user data for serialized transfer
    const userProfile = {
        ...user,
        createdAt: new Date(user.created_at).toISOString(),
        _count: {
            followers: user.followers?.[0]?.count || 0,
            following: user.following?.[0]?.count || 0
        }
    };

    const postsWithStatus = (posts || []).map((post) => ({
        ...post,
        mediaUrls: post.media_urls,
        createdAt: new Date(post.created_at).toISOString(),
        updatedAt: new Date(post.updated_at).toISOString(),
        likes: post.likes || [],
        isLikedInitial: post.likes?.some((l: { user_id: string }) => l.user_id === currentUserId),
        isFollowingAuthorInitial: isFollowing,
        _count: {
            likes: post.likes?.length || 0,
            comments: post.comments?.[0]?.count || 0
        }
    }));

    // Filter posts based on visibility
    const visiblePosts = postsWithStatus.filter((post) => {
        const visibility = post.visibility || "public";

        // Public posts are visible to everyone
        if (visibility === "public") return true;

        // If viewing own profile, show all posts
        if (currentUserId === id) return true;

        // Private posts only visible to author
        if (visibility === "private") return false;

        // Followers-only posts visible to followers
        if (visibility === "followers") {
            return isFollowing;
        }

        return true;
    });

    const displayName = (userProfile.name === "Nexus Explorer" || !userProfile.name) ? "Maddy" : userProfile.name;
    const userImage = userProfile.email === "maddy@connect.social"
        ? "https://i.pinimg.com/736x/13/f4/ed/13f4ed13e9d297b674b36cff7f8e273f.jpg"
        : userProfile.image;

    // Inject requested car posts if user is Maddy
    if (userProfile.email === "maddy@connect.social") {
        const carPosts = [
            {
                id: "porsche-public",
                content: "PORSCHE | Precision Engineering meets Aesthetic Perfection. #GT3 #Porsche",
                image: "https://i.pinimg.com/736x/a4/bc/11/a4bc11e9d297b674b36cff7f8e273f.jpg",
                createdAt: "2026-02-01T12:00:00Z",
                authorId: id,
                author: { id: id, name: "Maddy", email: userProfile.email, image: userImage },
                likes: [],
                _count: { likes: 5240, comments: 128 }
            },
            {
                id: "bmw-public",
                content: "BMW | The Ultimate Driving Machine. Neural Link integrated. #BMW #M4",
                image: "https://i.pinimg.com/1200x/e9/af/cb/e9afcba2d4fee6ae2f2258cd8eb9901e.jpg",
                createdAt: "2026-02-01T11:00:00Z",
                authorId: id,
                author: { id: id, name: "Maddy", email: userProfile.email, image: userImage },
                likes: [],
                _count: { likes: 8920, comments: 245 }
            }
        ];
        // @ts-ignore
        visiblePosts.unshift(...carPosts);
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Premium Profile Header */}
            <div className="card-simple p-0 relative overflow-hidden bg-white dark:bg-card border-none shadow-2xl">
                {/* Modern Cover Backdrop */}
                <div className="h-40 md:h-56 w-full bg-gradient-to-r from-primary/20 via-primary/5 to-transparent relative">
                    <div className="absolute inset-0 mesh-bg opacity-30" />
                </div>

                <div className="px-8 md:px-12 pb-12 -mt-20 md:-mt-24 relative z-10">
                    <div className="flex flex-col md:flex-row items-end md:items-end gap-6 md:gap-10">
                        {/* Profile Picture */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-background shadow-2xl overflow-hidden bg-secondary relative z-10 transition-transform duration-500 group-hover:scale-105">
                                {userImage ? (
                                    <Image src={userImage} alt={displayName} width={176} height={176} className="object-cover h-full w-full" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary text-5xl font-black bg-primary/5">
                                        {displayName[0]}
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        <div className="flex-1 space-y-4 pb-2">
                            <div className="space-y-1">
                                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase">{displayName}</h1>
                                <p className="text-primary font-bold tracking-widest text-[10px] uppercase opacity-60">Verified Member</p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-[10px] font-black tracking-widest uppercase text-muted py-2 border-y border-border/10">
                                <span className="flex items-center space-x-1.5 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/10">
                                    <MapPin className="w-3 h-3 text-primary" />
                                    <span>Global Node</span>
                                </span>
                                <span className="flex items-center space-x-1.5 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/10">
                                    <Calendar className="w-3 h-3 text-primary" />
                                    <span>Linked {format(new Date(userProfile.createdAt), "yyyy")}</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4 pb-2 items-center">
                            <FollowButton
                                userId={userProfile.id}
                                initialIsFollowing={isFollowing}
                                className="scale-110 !px-8 !py-3 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                            />
                            <Link
                                href={`/chat?userId=${userProfile.id}`}
                                className="flex items-center space-x-2 bg-secondary/50 hover:bg-secondary transition-colors px-6 py-3 rounded-xl border border-border/50 text-sm font-bold uppercase tracking-widest"
                            >
                                <MessageSquare className="w-4 h-4 text-primary" />
                                <span>Message</span>
                            </Link>
                        </div>
                    </div>

                    <div className="flex gap-12 pt-10 border-t border-border/5">
                        <div className="group cursor-pointer">
                            <p className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">
                                {displayName === "Maddy" ? "100.0M" : userProfile._count.followers}
                            </p>
                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] group-hover:text-foreground transition-colors">Followers</p>
                        </div>
                        <div className="group cursor-pointer">
                            <p className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">
                                {displayName === "Maddy" ? "1" : userProfile._count.following}
                            </p>
                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] group-hover:text-foreground transition-colors">Following</p>
                        </div>
                        <div className="group cursor-pointer">
                            <p className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{visiblePosts.length}</p>
                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] group-hover:text-foreground transition-colors">Transmissions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Feed */}
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex border-b border-border">
                    <button className="flex items-center space-x-2 px-8 py-4 text-sm font-bold transition-all relative text-primary">
                        <Grid className="w-4 h-4" />
                        <span>Posts</span>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    </button>
                    <button className="flex items-center space-x-2 px-8 py-4 text-sm font-bold transition-all relative text-muted hover:text-foreground">
                        <Heart className="w-4 h-4" />
                        <span>Likes</span>
                    </button>
                </div>

                <ErrorBoundary>
                    <div className="space-y-6">
                        {visiblePosts.length > 0 ? (
                            visiblePosts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    isFollowingAuthorInitial={isFollowing}
                                />
                            ))
                        ) : (
                            <div className="text-center py-20 card-simple border-dashed">
                                <p className="text-muted font-medium">No posts yet.</p>
                            </div>
                        )}
                    </div>
                </ErrorBoundary>
            </div>
        </div>
    );
}
