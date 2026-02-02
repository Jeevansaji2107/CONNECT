import { discoverGroups } from "@/lib/actions/group-actions";
import { auth } from "@/auth";
import { DiscoverGroups } from "@/components/groups/DiscoverGroups";

export default async function DiscoverPage() {
    const session = await auth();
    const result = await discoverGroups();

    return (
        <DiscoverGroups
            groups={result.success ? (result.data || []) : []}
            isLoggedIn={!!session?.user?.id}
        />
    );
}
