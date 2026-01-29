"use client";

import { Skeleton } from "./Skeleton";

export const PostSkeleton = () => {
    return (
        <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Skeleton circle width={40} height={40} />
                    <div className="space-y-2">
                        <Skeleton width={120} height={14} />
                        <Skeleton width={60} height={10} />
                    </div>
                </div>
                <Skeleton width={20} height={20} />
            </div>

            <div className="space-y-2">
                <Skeleton width="100%" height={16} />
                <Skeleton width="90%" height={16} />
                <Skeleton width="40%" height={16} />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-glass-border">
                <div className="flex space-x-6">
                    <Skeleton width={40} height={20} />
                    <Skeleton width={40} height={20} />
                </div>
            </div>
        </div>
    );
};
