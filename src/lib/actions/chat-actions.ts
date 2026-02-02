"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@/auth";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function sendMessage(content: string, receiverId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" };
    }

    try {
        const { data, error } = await supabase.from("messages").insert({
            content,
            sender_id: session.user.id,
            receiver_id: receiverId,
            created_at: new Date().toISOString(),
            is_read: false
        }).select().single();

        if (error) {
            console.error("Error sending message:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Server error sending message:", error);
        return { success: false, error: "Server error" };
    }
}

export async function getMessages(otherUserId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" };
    }

    try {
        // Fetch conversation between current user and other user
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${session.user.id})`)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Server error fetching messages:", error);
        return { success: false, error: "Server error" };
    }
}

export async function getUsersForChat() {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" };
    }

    try {
        // Fetch all users who have either sent or received a message with the current user
        // We do this by first finding unique sender/receiver IDs in the messages table
        const { data: sentMsgs, error: sentError } = await supabase
            .from("messages")
            .select("receiver_id")
            .eq("sender_id", session.user.id);

        const { data: receivedMsgs, error: receivedError } = await supabase
            .from("messages")
            .select("sender_id")
            .eq("receiver_id", session.user.id);

        if (sentError || receivedError) {
            console.error("Error fetching message history:", sentError || receivedError);
            return { success: false, error: "History scan failed" };
        }

        const interactedIds = Array.from(new Set([
            ...(sentMsgs?.map(m => m.receiver_id) || []),
            ...(receivedMsgs?.map(m => m.sender_id) || [])
        ]));

        if (interactedIds.length === 0) {
            return { success: true, data: [] };
        }

        // Now fetch user details for these IDs
        const { data: users, error: userError } = await supabase
            .from("users")
            .select("id, name, email, image")
            .in("id", interactedIds);

        if (userError) {
            console.error("Error fetching interactors:", userError);
            return { success: false, error: userError.message };
        }

        // Get last messages for each
        const usersWithLastMsg = await Promise.all(users.map(async (u) => {
            const { data: lastMsg } = await supabase
                .from("messages")
                .select("content, created_at")
                .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${u.id}),and(sender_id.eq.${u.id},receiver_id.eq.${session.user.id})`)
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            return {
                ...u,
                lastMsg: lastMsg?.content || null,
                last_msg_time: lastMsg?.created_at || null
            };
        }));

        return { success: true, data: usersWithLastMsg };

    } catch (error) {
        console.error("Server error fetching users:", error);
        return { success: false, error: "Server error" };
    }
}

export async function getUserById(userId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Not authenticated" };

    try {
        const { data, error } = await supabase
            .from("users")
            .select("id, name, email, image")
            .eq("id", userId)
            .single();

        if (error) return { success: false, error: error.message };
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Server error" };
    }
}

export async function searchUsers(query: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Not authenticated" };

    try {
        const { data, error } = await supabase
            .from("users")
            .select("id, name, email, image")
            .neq("id", session.user.id)
            .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
            .limit(10);

        if (error) {
            console.error("Search error:", error);
            return { success: false, error: error.message };
        }
        return { success: true, data: data || [] };
    } catch (error) {
        console.error("Search server error:", error);
        return { success: false, error: "Server error" };
    }
}
