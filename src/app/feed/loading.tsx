import { PostSkeleton } from "@/components/shared/PostSkeleton";
import { Skeleton } from "@/components/shared/Skeleton";

export default function FeedLoading() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-2xl mx-auto space-y-6">
            <div className="glass-card p-4 space-y-4">
                <div className="flex space-x-4">
                    <Skeleton circle width={40} height={40} />
                    <Skeleton width="100%" height={100} />
                </div>
            </div>

            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <PostSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
