"use server"

import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { triggerNotification } from "@/lib/socket-utils";

export async function createComment(postId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    try {
        const { data: comment, error: insertError } = await supabase
            .from("comments")
            .insert({
                content,
                post_id: postId,
                author_id: userId,
            })
            .select(`
                *,
                author:users (id, name, image)
            `)
            .single();

        if (insertError) throw insertError;

        // Notify post author
        const { data: post } = await supabase
            .from("posts")
            .select("author_id, content")
            .eq("id", postId)
            .single();

        if (post && post.author_id !== userId) {
            const { data: user } = await supabase
                .from("users")
                .select("name")
                .eq("id", userId)
                .single();

            triggerNotification(post.author_id, {
                title: "New Comment! 💬",
                message: `${user?.name || "Someone"} commented: "${content.substring(0, 20)}..." on your post`,
                icon: "💬"
            });
        }

        revalidatePath("/feed");
        return { success: true, comment };
    } catch (error) {
        console.error("Failed to create comment:", error);
        return { success: false, error: "Failed to create comment" };
    }
}

export async function deleteComment(commentId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        const { data: comment, error: fetchError } = await supabase
            .from("comments")
            .select("author_id")
            .eq("id", commentId)
            .single();

        if (fetchError || !comment || comment.author_id !== session.user.id) {
            throw new Error("Unauthorized or comment not found");
        }

        const { error: deleteError } = await supabase
            .from("comments")
            .delete()
            .eq("id", commentId);

        if (deleteError) throw deleteError;

        revalidatePath("/feed");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete comment:", error);
        return { success: false, error: "Failed to delete comment" };
    }
}

export async function getComments(postId: string) {
    try {
        const { data: comments, error } = await supabase
            .from("comments")
            .select(`
                *,
                author:users (id, name, image)
            `)
            .eq("post_id", postId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return { success: true, comments };
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        return { success: false, error: "Failed to fetch comments" };
    }
}
