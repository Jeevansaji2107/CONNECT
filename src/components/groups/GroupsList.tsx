"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Compass } from "lucide-react";
import Link from "next/link";
import { getUserGroups } from "@/lib/actions/group-actions";
import { GroupCard } from "@/components/groups/GroupCard";
import { CreateGroupModal } from "@/components/groups/CreateGroupModal";
import type { Group } from "@/lib/actions/group-actions";

interface GroupsListProps {
    initialGroups: Group[];
}

export const GroupsList = ({ initialGroups }: GroupsListProps) => {
    const [groups, setGroups] = useState<Group[]>(initialGroups);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadGroups = useCallback(async () => {
        const result = await getUserGroups();
        if (result.success && result.data) {
            setGroups(result.data);
        }
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Groups</h1>
                    <p className="text-muted">Collaborate with your communities</p>
                </div>
                <div className="flex space-x-3">
                    <Link
                        href="/groups/discover"
                        className="btn-outline flex items-center space-x-2"
                    >
                        <Compass className="w-5 h-5" />
                        <span>Discover</span>
                    </Link>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Group</span>
                    </button>
                </div>
            </div>

            {/* Groups Grid */}
            {groups.length > 0 ? (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {groups.map((group) => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-20 card-simple">
                    <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
                        <Users className="w-10 h-10 opacity-20" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No groups yet</h3>
                    <p className="text-muted mb-6">Create your first group to get started</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary inline-flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Group</span>
                    </button>
                </div>
            )}

            {/* Create Group Modal */}
            <CreateGroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadGroups}
            />
        </div>
    );
};
