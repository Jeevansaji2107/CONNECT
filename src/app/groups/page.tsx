import { getUserGroups } from "@/lib/actions/group-actions";
import { GroupsList } from "@/components/groups/GroupsList";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
    const result = await getUserGroups();

    return <GroupsList initialGroups={result.data || []} />;
}
