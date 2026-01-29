import { PostSkeleton } from "@/components/shared/PostSkeleton";
import { Skeleton } from "@/components/shared/Skeleton";

export default function ExploreLoading() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto space-y-8">
            <Skeleton width="100%" height={60} className="rounded-2xl" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section className="space-y-6">
                        <Skeleton width={150} height={24} />
                        <div className="space-y-6">
                            {[1, 2].map((i) => (
                                <PostSkeleton key={i} />
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="space-y-6">
                        <Skeleton width={150} height={24} />
                        <div className="glass-card divide-y divide-glass-border">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Skeleton circle width={40} height={40} />
                                        <div className="space-y-2">
                                            <Skeleton width={80} height={12} />
                                            <Skeleton width={40} height={10} />
                                        </div>
                                    </div>
                                    <Skeleton width={50} height={10} />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <Skeleton width={150} height={24} />
                        <div className="glass-card p-6 space-y-4">
                            <Skeleton width="100%" height={40} />
                            <Skeleton width="100%" height={60} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
