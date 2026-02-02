"use server"

import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, mediaUrls: string[] = [], visibility: "public" | "followers" | "private" = "public") {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        const { data: post, error } = await supabase
            .from("posts")
            .insert({
                content,
                media_urls: mediaUrls,
                author_id: session.user.id,
                visibility
            })
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/feed");
        return { success: true, post };
    } catch (error) {
        console.error("Failed to create post:", error);
        return { success: false, error: "Failed to create post" };
    }
}

export async function deletePost(postId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        const { data: post, error: fetchError } = await supabase
            .from("posts")
            .select("author_id")
            .eq("id", postId)
            .single();

        if (fetchError || !post || post.author_id !== session.user.id) {
            throw new Error("Unauthorized or post not found");
        }

        const { error: deleteError } = await supabase
            .from("posts")
            .delete()
            .eq("id", postId);

        if (deleteError) throw deleteError;

        revalidatePath("/feed");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete post:", error);
        return { success: false, error: "Failed to delete post" };
    }
}

export async function reactToPost(postId: string, reactionType: string = "like") {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    try {
        // Upsert reaction
        const { error } = await supabase
            .from("likes")
            .upsert({
                user_id: userId,
                post_id: postId,
                reaction_type: reactionType // Assuming reaction_type column exists or fallback to like
            }, { onConflict: "user_id,post_id" });

        if (error) throw error;
        revalidatePath("/feed");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to react to post" };
    }
}

export async function toggleBookmark(postId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    try {
        const { data: existing } = await supabase
            .from("bookmarks")
            .select("id")
            .eq("user_id", userId)
            .eq("post_id", postId)
            .maybeSingle();

        if (existing) {
            await supabase.from("bookmarks").delete().eq("id", existing.id);
        } else {
            await supabase.from("bookmarks").insert({ user_id: userId, post_id: postId });
        }

        revalidatePath("/feed");
        return { success: true, bookmarked: !existing };
    } catch (error) {
        return { success: false, error: "Failed to toggle bookmark" };
    }
}

export async function likePost(postId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    try {
        const { error } = await supabase
            .from("likes")
            .insert({ user_id: userId, post_id: postId });
        if (error) throw error;
        revalidatePath("/feed");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to like post" };
    }
}

export async function unlikePost(postId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    try {
        const { error } = await supabase
            .from("likes")
            .delete()
            .eq("user_id", userId)
            .eq("post_id", postId);
        if (error) throw error;
        revalidatePath("/feed");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to unlike post" };
    }
}

export async function getPosts(cursor?: string, limit: number = 10, filter: string = "all") {
    const session = await auth();
    const userId = session?.user?.id;

    try {
        let query = supabase
            .from("posts")
            .select(`
                *,
                author:users (
                    id,
                    name,
                    email,
                    image
                ),
                likes (user_id)
            `)
            .limit(limit);

        // Apply Filter Logic
        if (filter === "top") {
            // Sorting by likes is complex in Supabase without a RPC or a count column.
            // For now, we'll sort by created_at but increase visibility.
            // A better way is to use the existing order by created_at and let the client highlight top ones,
            // or perform a more advanced query if the schema is updated.
            query = query.order("created_at", { ascending: false });
        } else if (filter === "following" && userId) {
            const { data: follows } = await supabase
                .from("follows")
                .select("following_id")
                .eq("follower_id", userId);
            const followingIds = (follows || []).map(f => f.following_id);
            query = query.in("author_id", followingIds);
            query = query.order("created_at", { ascending: false });
        } else {
            query = query.order("created_at", { ascending: false });
        }

        if (cursor) {
            const { data: cursorPost } = await supabase
                .from("posts")
                .select("created_at")
                .eq("id", cursor)
                .single();

            if (cursorPost) {
                query = query.lt("created_at", cursorPost.created_at);
            }
        }

        const { data: posts, error } = await query;

        if (error) {
            console.error("Supabase Error Details:", error.message || error);
            throw new Error(error.message || "Database Query Failed");
        }

        if (!posts) return { success: true, posts: [], nextCursor: undefined };

        // Follows check
        let followingIds: string[] = [];
        if (userId) {
            const { data: follows } = await supabase
                .from("follows")
                .select("following_id")
                .eq("follower_id", userId);
            followingIds = (follows || []).map(f => f.following_id);
        }

        const formattedPosts = posts.map((post) => ({
            ...post,
            mediaUrls: post.media_urls,
            createdAt: new Date(post.created_at).toISOString(),
            updatedAt: new Date(post.updated_at).toISOString(),
            likes: post.likes || [],
            _count: {
                likes: post.likes?.length || 0,
                comments: 0 // Simplified for debugging
            },
            isLikedInitial: post.likes?.some((l: { user_id: string }) => l.user_id === userId),
            isFollowingAuthorInitial: followingIds.includes(post.author_id)
        }));

        // Filter posts based on visibility
        const visiblePosts = formattedPosts.filter((post) => {
            const visibility = post.visibility || "public";

            // Public posts are visible to everyone
            if (visibility === "public") return true;

            // If not logged in, only show public posts
            if (!userId) return false;

            // Private posts only visible to author
            if (visibility === "private") {
                return post.author_id === userId;
            }

            // Followers-only posts visible to author and followers
            if (visibility === "followers") {
                return post.author_id === userId || followingIds.includes(post.author_id);
            }

            return true;
        });

        const nextCursor = visiblePosts.length === limit ? visiblePosts[visiblePosts.length - 1].id : undefined;

        return {
            success: true,
            posts: visiblePosts,
            nextCursor
        };
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch posts";
        return { success: false, error: errorMessage };
    }
}

export async function getTrendingPosts(limit: number = 5) {
    const session = await auth();
    const userId = session?.user?.id;

    try {
        const { data: posts, error } = await supabase
            .from("posts")
            .select(`
                *,
                author:users (
                    id,
                    name,
                    email,
                    image
                ),
                likes (user_id),
                comments (count)
            `)
            .limit(50);

        if (error) throw error;

        // Follows check
        let followingIds: string[] = [];
        if (userId) {
            const { data: follows } = await supabase
                .from("follows")
                .select("following_id")
                .eq("follower_id", userId);
            followingIds = (follows || []).map(f => f.following_id);
        }

        const formattedPosts = posts
            .map((post) => ({
                ...post,
                mediaUrls: post.media_urls,
                createdAt: new Date(post.created_at).toISOString(),
                updatedAt: new Date(post.updated_at).toISOString(),
                likes: post.likes || [],
                _count: {
                    likes: post.likes?.length || 0,
                    comments: post.comments?.[0]?.count || 0
                },
                isLikedInitial: post.likes?.some((l: { user_id: string }) => l.user_id === userId),
                isFollowingAuthorInitial: followingIds.includes(post.author_id)
            }))
            .sort((a, b) => b._count.likes - a._count.likes)
            .slice(0, limit);

        return {
            success: true,
            posts: formattedPosts
        };
    } catch (error) {
        console.error("Failed to fetch trending posts:", error);
        return { success: false, error: "Failed to fetch trending posts" };
    }
}

export async function createComment(postId: string, content: string, parentId?: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        const { error } = await supabase
            .from("comments")
            .insert({
                post_id: postId,
                author_id: session.user.id,
                content,
                parent_id: parentId || null
            });
        if (error) throw error;
        revalidatePath("/feed");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to add comment" };
    }
}

export async function getComments(postId: string) {
    try {
        const { data: comments, error } = await supabase
            .from("comments")
            .select(`
                *,
                author:users (id, name, email, image)
            `)
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (error) throw error;

        const formattedComments = (comments || []).map((c) => ({
            ...c,
            createdAt: new Date(c.created_at).toISOString()
        }));

        return { success: true, data: formattedComments };
    } catch (error) {
        return { success: false, error: "Failed to fetch comments" };
    }
}

export async function searchPosts(query: string) {
    const session = await auth();
    const userId = session?.user?.id;

    try {
        const { data: posts, error } = await supabase
            .from("posts")
            .select(`
                *,
                author:users (id, name, email, image),
                likes (user_id),
                comments (count)
            `)
            .ilike("content", `%${query}%`)
            .order("created_at", { ascending: false })
            .limit(20);

        if (error) throw error;

        // Follows check
        let followingIds: string[] = [];
        if (userId) {
            const { data: follows } = await supabase
                .from("follows")
                .select("following_id")
                .eq("follower_id", userId);
            followingIds = (follows || []).map(f => f.following_id);
        }

        const formattedPosts = (posts || []).map((post) => ({
            ...post,
            mediaUrls: post.media_urls,
            createdAt: new Date(post.created_at).toISOString(),
            updatedAt: new Date(post.updated_at).toISOString(),
            likes: post.likes || [],
            _count: {
                likes: post.likes?.length || 0,
                comments: post.comments?.[0]?.count || 0
            },
            isLikedInitial: post.likes?.some((l: { user_id: string }) => l.user_id === userId),
            isFollowingAuthorInitial: followingIds.includes(post.author_id)
        }));

        return { success: true, posts: formattedPosts };
    } catch (error) {
        console.error("Failed to search posts:", error);
        return { success: false, error: "Failed to search posts" };
    }
}
