"use server";

import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export interface Group {
    id: string;
    name: string;
    description: string | null;
    avatar: string | null;
    cover_image: string | null;
    location: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
    visibility: "public" | "private";
    member_count: number;
    tags: string[];
}

export interface GroupMember {
    id: string;
    group_id: string;
    user_id: string;
    role: "owner" | "admin" | "moderator" | "member";
    joined_at: string;
    permissions: Record<string, any>;
    user?: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
}

// Create a new group
export async function createGroup(name: string, description?: string, visibility: "public" | "private" = "public") {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Create group
        const { data: group, error: groupError } = await supabase
            .from("groups")
            .insert({
                name,
                description: description || null,
                created_by: session.user.id,
                visibility
            })
            .select()
            .single();

        if (groupError || !group) {
            console.error("Group creation error:", groupError);
            return { success: false, error: "Failed to create group" };
        }

        // Add creator as owner
        const { error: memberError } = await supabase
            .from("group_members")
            .insert({
                group_id: group.id,
                user_id: session.user.id,
                role: "owner"
            });

        if (memberError) {
            console.error("Member creation error:", memberError);
            return { success: false, error: "Failed to add owner" };
        }

        revalidatePath("/groups");
        return { success: true, data: group };
    } catch (error) {
        console.error("Create group error:", error);
        return { success: false, error: "Failed to create group" };
    }
}

// Get group by ID
export async function getGroup(groupId: string) {
    try {
        const session = await auth();

        const { data: group, error } = await supabase
            .from("groups")
            .select(`
                *,
                creator:users!groups_created_by_fkey (name, image),
                member:group_members!inner (user_id, role)
            `)
            .eq("id", groupId)
            .single();

        if (error || !group) {
            return { success: false, error: "Group not found" };
        }

        // Check if user is a member
        const isMember = session?.user?.id && group.member?.some((m: any) => m.user_id === session.user.id);
        const userRole = isMember ? group.member?.find((m: any) => m.user_id === session.user.id)?.role : null;

        // Check visibility
        if (group.visibility === "private" && !isMember) {
            return { success: false, error: "Access denied" };
        }

        return {
            success: true,
            data: {
                ...group,
                is_member: isMember,
                user_role: userRole
            }
        };
    } catch (error) {
        console.error("Get group error:", error);
        return { success: false, error: "Failed to fetch group" };
    }
}

// Get user's groups
export async function getUserGroups() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const { data: memberships, error } = await supabase
            .from("group_members")
            .select(`
                role,
                joined_at,
                group:groups (*)
            `)
            .eq("user_id", session.user.id)
            .order("joined_at", { ascending: false });

        if (error) {
            console.error("Get user groups error:", error);
            return { success: false, error: "Failed to fetch groups" };
        }

        const groups = memberships?.map((m: any) => ({
            ...m.group,
            role: m.role,
            joined_at: m.joined_at
        })) || [];

        return { success: true, data: groups };
    } catch (error) {
        console.error("Get user groups error:", error);
        return { success: false, error: "Failed to fetch groups" };
    }
}

// Add member to group
export async function addGroupMember(groupId: string, userId: string, role: "admin" | "moderator" | "member" = "member") {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Check if requester is owner or admin
        const { data: requesterMember, error: roleError } = await supabase
            .from("group_members")
            .select("role")
            .eq("group_id", groupId)
            .eq("user_id", session.user.id)
            .single();

        if (roleError || !requesterMember || !["owner", "admin"].includes(requesterMember.role)) {
            return { success: false, error: "Insufficient permissions" };
        }

        // Add member
        const { error: insertError } = await supabase
            .from("group_members")
            .insert({
                group_id: groupId,
                user_id: userId,
                role
            });

        if (insertError) {
            console.error("Add member error:", insertError);
            return { success: false, error: "Failed to add member" };
        }

        // Notify target user
        try {
            const { triggerNotification } = await import("@/lib/socket-utils");
            const { data: group } = await supabase
                .from("groups")
                .select("name")
                .eq("id", groupId)
                .single();

            triggerNotification(userId, {
                title: "Added to Group! 👥",
                message: `You have been added to the group "${group?.name || "a new group"}"`,
                icon: "👥"
            });
        } catch (e) {
            console.error("Failed to notify user:", e);
        }

        revalidatePath(`/groups/${groupId}`);
        return { success: true };
    } catch (error) {
        console.error("Add group member error:", error);
        return { success: false, error: "Failed to add member" };
    }
}

// Remove member from group
export async function removeGroupMember(groupId: string, userId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Check if requester is owner or admin
        const { data: requesterMember, error: roleError } = await supabase
            .from("group_members")
            .select("role")
            .eq("group_id", groupId)
            .eq("user_id", session.user.id)
            .single();

        if (roleError || !requesterMember || !["owner", "admin"].includes(requesterMember.role)) {
            return { success: false, error: "Insufficient permissions" };
        }

        // Cannot remove owner
        const { data: targetMember } = await supabase
            .from("group_members")
            .select("role")
            .eq("group_id", groupId)
            .eq("user_id", userId)
            .single();

        if (targetMember?.role === "owner") {
            return { success: false, error: "Cannot remove group owner" };
        }

        const { error: deleteError } = await supabase
            .from("group_members")
            .delete()
            .eq("group_id", groupId)
            .eq("user_id", userId);

        if (deleteError) {
            console.error("Remove member error:", deleteError);
            return { success: false, error: "Failed to remove member" };
        }

        revalidatePath(`/groups/${groupId}`);
        return { success: true };
    } catch (error) {
        console.error("Remove group member error:", error);
        return { success: false, error: "Failed to remove member" };
    }
}

// Get group members
export async function getGroupMembers(groupId: string) {
    try {
        const { data: members, error: membersError } = await supabase
            .from("group_members")
            .select(`
                *,
                user:users (id, name, email, image)
            `)
            .eq("group_id", groupId)
            .order("joined_at", { ascending: true }) as { data: (GroupMember & { user: { id: string; name: string | null; email: string | null; image: string | null; } })[] | null, error: any };

        if (membersError) {
            console.error("Get members error:", membersError);
            return { success: false, error: "Failed to fetch members" };
        }

        // Sort by role priority
        const sortedMembers = members?.sort((a, b) => {
            const roleOrder = { owner: 1, admin: 2, moderator: 3, member: 4 };
            return (roleOrder[a.role as keyof typeof roleOrder] || 5) - (roleOrder[b.role as keyof typeof roleOrder] || 5);
        });

        return { success: true, data: sortedMembers || [] };
    } catch (error) {
        console.error("Get group members error:", error);
        return { success: false, error: "Failed to fetch members" };
    }
}

// Delete group
export async function deleteGroup(groupId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Check if requester is owner
        const { data: member, error: roleError } = await supabase
            .from("group_members")
            .select("role")
            .eq("group_id", groupId)
            .eq("user_id", session.user.id)
            .single();

        if (roleError || member?.role !== "owner") {
            return { success: false, error: "Only group owner can delete the group" };
        }

        const { error: deleteError } = await supabase
            .from("groups")
            .delete()
            .eq("id", groupId);

        if (deleteError) {
            console.error("Delete group error:", deleteError);
            return { success: false, error: "Failed to delete group" };
        }

        revalidatePath("/groups");
        return { success: true };
    } catch (error) {
        console.error("Delete group error:", error);
        return { success: false, error: "Failed to delete group" };
    }
}

// Update group details
export async function updateGroup(groupId: string, updates: {
    name?: string;
    description?: string;
    visibility?: "public" | "private";
    avatar?: string;
    cover_image?: string;
    tags?: string[];
    location?: string;
}) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Check if requester is owner or admin
        const { data: member, error: roleError } = await supabase
            .from("group_members")
            .select("role")
            .eq("group_id", groupId)
            .eq("user_id", session.user.id)
            .single();

        if (roleError || !member || !["owner", "admin"].includes(member.role)) {
            return { success: false, error: "Insufficient permissions" };
        }

        const { error: updateError } = await supabase
            .from("groups")
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq("id", groupId);

        if (updateError) {
            console.error("Update group error:", updateError);
            return { success: false, error: "Failed to update group" };
        }

        revalidatePath(`/groups/${groupId}`);
        return { success: true };
    } catch (error) {
        console.error("Update group error:", error);
        return { success: false, error: "Failed to update group" };
    }
}

// Update member role
export async function updateMemberRole(groupId: string, userId: string, newRole: "admin" | "moderator" | "member") {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Check if requester is owner
        const { data: requesterMember, error: roleError } = await supabase
            .from("group_members")
            .select("role")
            .eq("group_id", groupId)
            .eq("user_id", session.user.id)
            .single();

        if (roleError || requesterMember?.role !== "owner") {
            return { success: false, error: "Only group owner can change roles" };
        }

        // Cannot change owner role
        const { data: targetMember } = await supabase
            .from("group_members")
            .select("role")
            .eq("group_id", groupId)
            .eq("user_id", userId)
            .single();

        if (targetMember?.role === "owner") {
            return { success: false, error: "Cannot change owner role" };
        }

        const { error: updateError } = await supabase
            .from("group_members")
            .update({ role: newRole })
            .eq("group_id", groupId)
            .eq("user_id", userId);

        if (updateError) {
            console.error("Update role error:", updateError);
            return { success: false, error: "Failed to update role" };
        }

        revalidatePath(`/groups/${groupId}`);
        return { success: true };
    } catch (error) {
        console.error("Update member role error:", error);
        return { success: false, error: "Failed to update role" };
    }
}

// Create group post
export async function createGroupPost(groupId: string, content: string, image?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Check if user is a member
        const { data: member, error: memberError } = await supabase
            .from("group_members")
            .select("id")
            .eq("group_id", groupId)
            .eq("user_id", session.user.id)
            .single();

        if (memberError || !member) {
            return { success: false, error: "Only group members can post" };
        }

        const { data: post, error: postError } = await supabase
            .from("group_posts")
            .insert({
                group_id: groupId,
                author_id: session.user.id,
                content,
                image: image || null
            })
            .select()
            .single();

        if (postError || !post) {
            console.error("Create post error:", postError);
            return { success: false, error: "Failed to create post" };
        }

        revalidatePath(`/groups/${groupId}`);
        return { success: true, data: post };
    } catch (error) {
        console.error("Create group post error:", error);
        return { success: false, error: "Failed to create post" };
    }
}

// Get group posts
export async function getGroupPosts(groupId: string, cursor?: string, limit: number = 10) {
    try {
        let query = supabase
            .from("group_posts")
            .select(`
                *,
                author:users (id, name, email, image),
                likes:group_post_likes (user_id),
                comments:group_post_comments (count)
            `)
            .eq("group_id", groupId)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (cursor) {
            const { data: cursorPost } = await supabase
                .from("group_posts")
                .select("created_at")
                .eq("id", cursor)
                .single();

            if (cursorPost) {
                query = query.lt("created_at", cursorPost.created_at);
            }
        }

        const { data: posts, error } = await query;

        if (error) {
            console.error("Get posts error:", error);
            return { success: false, error: "Failed to fetch posts" };
        }

        const session = await auth();
        const userId = session?.user?.id;

        const formattedPosts = (posts || []).map((post: any) => ({
            ...post,
            createdAt: new Date(post.created_at).toISOString(),
            updatedAt: new Date(post.updated_at).toISOString(),
            _count: {
                likes: post.likes?.length || 0,
                comments: post.comments?.[0]?.count || 0
            },
            isLiked: userId ? post.likes?.some((l: any) => l.user_id === userId) : false
        }));

        const nextCursor = formattedPosts.length === limit ? formattedPosts[formattedPosts.length - 1].id : undefined;

        return { success: true, data: formattedPosts, nextCursor };
    } catch (error) {
        console.error("Get group posts error:", error);
        return { success: false, error: "Failed to fetch posts" };
    }
}

// Like group post
export async function likeGroupPost(postId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const { error } = await supabase
            .from("group_post_likes")
            .insert({
                post_id: postId,
                user_id: session.user.id
            });

        if (error) {
            // If already liked, unlike
            if (error.code === "23505") {
                const { error: deleteError } = await supabase
                    .from("group_post_likes")
                    .delete()
                    .eq("post_id", postId)
                    .eq("user_id", session.user.id);

                if (deleteError) {
                    return { success: false, error: "Failed to unlike post" };
                }
                return { success: true, liked: false };
            }
            return { success: false, error: "Failed to like post" };
        }

        // Notify post author
        try {
            const { data: post } = await supabase
                .from("group_posts")
                .select("author_id")
                .eq("id", postId)
                .single();

            if (post && post.author_id !== session.user.id) {
                const { triggerNotification } = await import("@/lib/socket-utils");
                triggerNotification(post.author_id, {
                    title: "Post Liked! ❤️",
                    message: `${session.user.name || "Someone"} liked your group post`,
                    icon: "❤️"
                });
            }
        } catch (e) {
            console.error("Failed to notify user:", e);
        }

        return { success: true, liked: true };
    } catch (error) {
        console.error("Like post error:", error);
        return { success: false, error: "Failed to like post" };
    }
}

// Join public group
export async function joinGroup(groupId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Check if group is public
        const { data: group, error: groupError } = await supabase
            .from("groups")
            .select("visibility")
            .eq("id", groupId)
            .single();

        if (groupError || !group) {
            return { success: false, error: "Group not found" };
        }

        if (group.visibility !== "public") {
            return { success: false, error: "Cannot join private group" };
        }

        // Add as member
        const { error: joinError } = await supabase
            .from("group_members")
            .insert({
                group_id: groupId,
                user_id: session.user.id,
                role: "member"
            });

        if (joinError) {
            if (joinError.code === "23505") {
                return { success: false, error: "Already a member" };
            }
            return { success: false, error: "Failed to join group" };
        }

        revalidatePath(`/groups/${groupId}`);
        revalidatePath("/groups");
        return { success: true };
    } catch (error) {
        console.error("Join group error:", error);
        return { success: false, error: "Failed to join group" };
    }
}

// Leave group
export async function leaveGroup(groupId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Check if user is owner
        const { data: member } = await supabase
            .from("group_members")
            .select("role")
            .eq("group_id", groupId)
            .eq("user_id", session.user.id)
            .single();

        if (member?.role === "owner") {
            return { success: false, error: "Owner cannot leave group. Transfer ownership or delete the group." };
        }

        const { error } = await supabase
            .from("group_members")
            .delete()
            .eq("group_id", groupId)
            .eq("user_id", session.user.id);

        if (error) {
            return { success: false, error: "Failed to leave group" };
        }

        revalidatePath(`/groups/${groupId}`);
        revalidatePath("/groups");
        return { success: true };
    } catch (error) {
        console.error("Leave group error:", error);
        return { success: false, error: "Failed to leave group" };
    }
}

// Discover public groups
export async function discoverGroups(limit: number = 20) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        const { data: groups, error } = await supabase
            .from("groups")
            .select(`
                *,
                creator:users!groups_created_by_fkey (name, image)
            `)
            .eq("visibility", "public")
            .order("member_count", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Discover groups error:", error);
            return { success: false, error: "Failed to fetch groups" };
        }

        // Check which groups user is a member of
        let memberGroupIds: string[] = [];
        if (userId) {
            const { data: memberships } = await supabase
                .from("group_members")
                .select("group_id")
                .eq("user_id", userId);
            memberGroupIds = memberships?.map(m => m.group_id) || [];
        }

        const formattedGroups = (groups || []).map(group => ({
            ...group,
            is_member: memberGroupIds.includes(group.id)
        }));

        return { success: true, data: formattedGroups };
    } catch (error) {
        console.error("Discover groups error:", error);
        return { success: false, error: "Failed to discover groups" };
    }
}

// Get group post comments
export async function getGroupPostComments(postId: string) {
    try {
        const { data: comments, error } = await supabase
            .from("group_post_comments")
            .select(`
                *,
                author:users (id, name, image)
            `)
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Get comments error:", error);
            return { success: false, error: "Failed to fetch comments" };
        }

        return { success: true, data: comments };
    } catch (error) {
        console.error("Get group post comments error:", error);
        return { success: false, error: "Failed to fetch comments" };
    }
}

// Create group post comment
export async function createGroupPostComment(postId: string, content: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const { data: comment, error } = await supabase
            .from("group_post_comments")
            .insert({
                post_id: postId,
                author_id: session.user.id,
                content
            })
            .select(`
                *,
                author:users (id, name, image)
            `)
            .single();

        if (error || !comment) {
            console.error("Create comment error:", error);
            return { success: false, error: "Failed to create comment" };
        }

        // Notify post author
        const { data: post } = await supabase
            .from("group_posts")
            .select("author_id, group_id")
            .eq("id", postId)
            .single();

        if (post && post.author_id !== session.user.id) {
            const { triggerNotification } = await import("@/lib/socket-utils");
            triggerNotification(post.author_id, {
                title: "New Group Comment! 💬",
                message: `${session.user.name || "Someone"} commented on your post`,
                icon: "💬"
            });
        }

        return { success: true, data: comment };
    } catch (error) {
        console.error("Create group post comment error:", error);
        return { success: false, error: "Failed to create comment" };
    }
}

// Delete group post
export async function deleteGroupPost(postId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Get post to check group_id and author_id
        const { data: post, error: postError } = await supabase
            .from("group_posts")
            .select("group_id, author_id")
            .eq("id", postId)
            .single();

        if (postError || !post) {
            return { success: false, error: "Post not found" };
        }

        // Check if user is author OR admin/owner of the group
        const isAuthor = post.author_id === session.user.id;

        const { data: member, error: memberError } = await supabase
            .from("group_members")
            .select("role")
            .eq("group_id", post.group_id)
            .eq("user_id", session.user.id)
            .single();

        const isAdmin = member && ["owner", "admin", "moderator"].includes(member.role);

        if (!isAuthor && !isAdmin) {
            return { success: false, error: "Insufficient permissions" };
        }

        const { error: deleteError } = await supabase
            .from("group_posts")
            .delete()
            .eq("id", postId);

        if (deleteError) {
            console.error("Delete post error:", deleteError);
            return { success: false, error: "Failed to delete post" };
        }

        revalidatePath(`/groups/${post.group_id}`);
        return { success: true };
    } catch (error) {
        console.error("Delete group post error:", error);
        return { success: false, error: "Failed to delete post" };
    }
}
