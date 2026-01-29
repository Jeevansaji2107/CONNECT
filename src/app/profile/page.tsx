import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { ProfileView } from "@/components/profile/ProfileView";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const userId = session.user.id;

    // Fetch user details and follow counts
    const { data: user, error: userError } = await supabase
        .from("users")
        .select(`
            *,
            followers:follows!follows_following_id_fkey (count),
            following:follows!follows_follower_id_fkey (count)
        `)
        .eq("id", userId)
        .single();

    if (userError || !user) {
        return <div className="min-h-screen flex items-center justify-center font-mono text-red-500">CRITICAL_ERROR: NODE_NOT_FOUND</div>;
    }

    // Fetch user's posts
    const { data: posts } = await supabase
        .from("posts")
        .select(`
            *,
            author:users (id, name, email, image),
            likes (user_id),
            comments (count)
        `)
        .eq("author_id", userId)
        .order("created_at", { ascending: false });

    // Format user data for serialized transfer
    const formattedUser = {
        ...user,
        createdAt: new Date(user.created_at).toISOString(),
        _count: {
            followers: user.followers?.[0]?.count || 0,
            following: user.following?.[0]?.count || 0
        }
    };

    const formattedPosts = (posts || []).map((post) => ({
        ...post,
        mediaUrls: post.media_urls,
        createdAt: new Date(post.created_at).toISOString(),
        updatedAt: new Date(post.updated_at).toISOString(),
        likes: post.likes || [],
        isLikedInitial: post.likes?.some((l: { user_id: string }) => l.user_id === userId),
        isFollowingAuthorInitial: false,
        _count: {
            likes: post.likes?.length || 0,
            comments: post.comments?.[0]?.count || 0
        }
    }));

    return <ProfileView user={formattedUser} posts={formattedPosts} userId={userId} />;
}
