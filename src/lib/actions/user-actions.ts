"use server"

import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function toggleFollow(followingId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const followerId = session.user.id;

    if (followerId === followingId) {
        throw new Error("You cannot follow yourself");
    }

    try {
        const { data: existingFollow, error: fetchError } = await supabase
            .from("follows")
            .select("id")
            .eq("follower_id", followerId)
            .eq("following_id", followingId)
            .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingFollow) {
            const { error: deleteError } = await supabase
                .from("follows")
                .delete()
                .eq("id", existingFollow.id);
            if (deleteError) throw deleteError;
        } else {
            const { error: insertError } = await supabase
                .from("follows")
                .insert({
                    follower_id: followerId,
                    following_id: followingId
                });
            if (insertError) throw insertError;
        }

        revalidatePath(`/profile/${followingId}`);
        revalidatePath("/profile");
        return { success: true, followed: !existingFollow };
    } catch (error) {
        console.error("Failed to toggle follow:", error);
        return { success: false, error: "Failed to toggle follow" };
    }
}

export async function getSuggestedUsers(limit: number = 3) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const userId = session.user.id;

    try {
        // Get users who are not me and I don't follow
        // Since Supabase doesn't have a direct 'none' relation filter like Prisma,
        // we first get the list of people I follow.
        const { data: follows } = await supabase
            .from("follows")
            .select("following_id")
            .eq("follower_id", userId);

        const followingIds = (follows || []).map(f => f.following_id);

        const { data: users, error } = await supabase
            .from("users")
            .select(`
                id,
                name,
                image,
                followers:follows!follows_following_id_fkey (count)
            `)
            .neq("id", userId)
            .not("id", "in", `(${followingIds.length > 0 ? followingIds.join(",") : "00000000-0000-0000-0000-000000000000"})`)
            .limit(limit);

        if (error) throw error;

        const formattedUsers = users.map((user) => ({
            ...user,
            _count: {
                followers: user.followers?.[0]?.count || 0
            }
        }));

        return { success: true, users: formattedUsers };
    } catch (error) {
        console.error("Failed to fetch suggested users:", error);
        return { success: false, error: "Failed to fetch suggested users" };
    }
}

export async function searchUsers(query: string) {
    if (!query.trim()) return { success: true, users: [] };

    try {
        const { data: users, error } = await supabase
            .from("users")
            .select(`
                id,
                name,
                image,
                bio,
                followers:follows!follows_following_id_fkey (count)
            `)
            .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
            .limit(10);

        if (error) throw error;

        const formattedUsers = users.map((user) => ({
            ...user,
            _count: {
                followers: user.followers?.[0]?.count || 0
            }
        }));

        return { success: true, users: formattedUsers };
    } catch (error) {
        console.error("Failed to search users:", error);
        return { success: false, error: "Failed to search users" };
    }
}
