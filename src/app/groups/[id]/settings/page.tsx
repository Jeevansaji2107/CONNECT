import { getGroup, getGroupMembers } from "@/lib/actions/group-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GroupSettings } from "@/components/groups/GroupSettings";

interface GroupSettingsPageProps {
    params: Promise<{ id: string }>;
}

export default async function GroupSettingsPage({ params }: GroupSettingsPageProps) {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const groupResult = await getGroup(id);
    const membersResult = await getGroupMembers(id);

    if (!groupResult.success || !groupResult.data) {
        redirect(`/groups/${id}`);
    }

    // Check if user is owner or admin
    const userRole = groupResult.data.user_role;
    if (!userRole || !["owner", "admin"].includes(userRole)) {
        redirect(`/groups/${id}`);
    }

    return (
        <GroupSettings
            group={groupResult.data}
            members={membersResult.data || []}
            currentUserId={session.user.id}
            userRole={userRole}
        />
    );
}
