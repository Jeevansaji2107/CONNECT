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
import { ProfileView } from "@/components/profile/ProfileView";

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

    // Fetch bookmarks and likes if own profile
    let bookmarkedPosts: any[] = [];
    let likedPosts: any[] = [];
    if (currentUserId === id) {
        const { getBookmarkedPosts, getLikedPosts } = await import("@/lib/actions/post-actions");
        const [bookmarksResult, likesResult] = await Promise.all([
            getBookmarkedPosts(),
            getLikedPosts()
        ]);

        if (bookmarksResult.success) {
            bookmarkedPosts = bookmarksResult.posts || [];
        }
        if (likesResult.success) {
            likedPosts = likesResult.posts || [];
        }
    }

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
        <ProfileView
            user={userProfile}
            posts={visiblePosts}
            bookmarkedPosts={bookmarkedPosts}
            likedPosts={likedPosts}
            userId={currentUserId || ""}
        />
    );
}
