import { PostSkeleton } from "@/components/shared/PostSkeleton";
import { Skeleton } from "@/components/shared/Skeleton";

export default function UserProfileLoading() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto space-y-8">
            <div className="glass-card p-8 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
                    <Skeleton width={128} height={128} className="rounded-3xl" />

                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 justify-center md:justify-start">
                            <Skeleton width={200} height={32} />
                            <Skeleton width={100} height={32} className="rounded-full" />
                        </div>
                        <Skeleton width={150} height={16} className="mx-auto md:mx-0" />
                        <div className="flex justify-center md:justify-start gap-4">
                            <Skeleton width={80} height={20} />
                            <Skeleton width={80} height={20} />
                        </div>
                    </div>

                    <div className="flex space-x-8 text-center px-4">
                        <div className="space-y-2">
                            <Skeleton width={40} height={24} className="mx-auto" />
                            <Skeleton width={60} height={12} className="mx-auto" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton width={40} height={24} className="mx-auto" />
                            <Skeleton width={60} height={12} className="mx-auto" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-8">
                    <div className="glass-card p-6 space-y-4">
                        <Skeleton width={100} height={16} />
                        <Skeleton width="100%" height={80} />
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="flex space-x-6 border-b border-glass-border">
                        <Skeleton width={60} height={40} />
                    </div>
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <PostSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
