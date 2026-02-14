"use server"

import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false })
            .limit(20);

        if (error) throw error;

        return { success: true, data: data || [] };
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return { success: false, error: "Failed to fetch notifications" };
    }
}

export async function getUnreadCount() {
    const session = await auth();
    if (!session?.user?.id) return 0;

    try {
        const { count, error } = await supabase
            .from("notifications")
            .select("*", { count: "exact", head: true })
            .eq("user_id", session.user.id)
            .eq("read", false);

        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error("Failed to fetch unread count:", error);
        return 0;
    }
}

export async function markNotificationsAsRead() {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    try {
        const { error } = await supabase
            .from("notifications")
            .update({ read: true })
            .eq("user_id", session.user.id)
            .eq("read", false);

        if (error) throw error;
        revalidatePath("/feed"); // Revalidate home/feed to update badge
        return { success: true };
    } catch (error) {
        console.error("Failed to mark notifications as read:", error);
        return { success: false };
    }
}
