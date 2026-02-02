import { getGroup, getGroupMembers } from "@/lib/actions/group-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GroupView } from "@/components/groups/GroupView";

interface GroupPageProps {
    params: Promise<{ id: string }>;
}

export default async function GroupPage({ params }: GroupPageProps) {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const groupResult = await getGroup(id);
    const membersResult = await getGroupMembers(id);

    if (!groupResult.success || !groupResult.data) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 max-w-2xl mx-auto">
                <div className="text-center py-20 card-simple">
                    <h2 className="text-2xl font-bold mb-2">Group Not Found</h2>
                    <p className="text-muted">This group doesn&apos;t exist or you don&apos;t have access to it.</p>
                </div>
            </div>
        );
    }

    return (
        <GroupView
            group={groupResult.data}
            members={membersResult.data || []}
            currentUserId={session.user.id}
        />
    );
}
