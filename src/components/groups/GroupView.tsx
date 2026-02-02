"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Globe, Lock, Settings, UserPlus, LogOut, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { leaveGroup } from "@/lib/actions/group-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateGroupPost } from "./CreateGroupPost";
import { GroupFeed } from "./GroupFeed";
import { AddMemberModal } from "./AddMemberModal";

interface GroupViewProps {
    group: any;
    members: any[];
    currentUserId: string;
}

export const GroupView = ({ group, members, currentUserId }: GroupViewProps) => {
    const router = useRouter();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const isOwner = group.created_by === currentUserId;
    const isMember = group.is_member;
    const userRole = group.user_role;
    const canManage = userRole && ["owner", "admin"].includes(userRole);

    const handleLeave = async () => {
        if (!confirm("Are you sure you want to leave this group?")) return;

        setIsLeaving(true);
        const result = await leaveGroup(group.id);

        if (result.success) {
            toast.success("Left group");
            router.push("/groups");
        } else {
            toast.error(result.error || "Failed to leave group");
            setIsLeaving(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto">
            {/* Group Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-simple overflow-hidden mb-8"
            >
                {/* Cover Image */}
                <div className="h-48 w-full bg-gradient-to-r from-primary/20 to-secondary relative group/cover">
                    {group.cover_image ? (
                        <Image
                            src={group.cover_image}
                            alt="Group cover"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <span className="text-xs font-black tracking-[0.5em] uppercase">Connect Core Node</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>

                <div className="p-8 -mt-12 relative z-10">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-6">
                            {/* Group Avatar */}
                            <div className="w-24 h-24 rounded-2xl bg-card flex items-center justify-center border border-primary/20 shadow-2xl overflow-hidden shrink-0">
                                {group.avatar ? (
                                    <Image
                                        src={group.avatar}
                                        alt={group.name}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Users className="w-12 h-12 text-primary" />
                                )}
                            </div>

                            {/* Group Info */}
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-3xl font-extrabold">{group.name}</h1>
                                    {group.visibility === "private" ? (
                                        <Lock className="w-5 h-5 text-muted" />
                                    ) : (
                                        <Globe className="w-5 h-5 text-muted" />
                                    )}
                                </div>
                                {group.description && (
                                    <p className="text-muted mb-4 max-w-2xl">{group.description}</p>
                                )}

                                {/* Group Tags */}
                                {group.tags && group.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {group.tags.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-md border border-primary/20"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                                    {group.location && (
                                        <div className="flex items-center space-x-1.5 bg-secondary px-3 py-1 rounded-full border border-border">
                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                            <span className="font-bold text-xs">{group.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-1">
                                        <Users className="w-4 h-4 text-muted" />
                                        <span className="font-semibold text-muted">
                                            {group.member_count} {group.member_count === 1 ? "member" : "members"}
                                        </span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-muted" />
                                    <span className="text-muted capitalize">{group.visibility}</span>
                                    {userRole && (
                                        <>
                                            <div className="w-1 h-1 rounded-full bg-muted" />
                                            <span className="text-primary capitalize font-bold">{userRole}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                            {canManage && (
                                <Link
                                    href={`/groups/${group.id}/settings`}
                                    className="btn-outline flex items-center space-x-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>Settings</span>
                                </Link>
                            )}
                            {isMember && !isOwner && (
                                <button
                                    onClick={handleLeave}
                                    disabled={isLeaving}
                                    className="btn-outline text-red-500 border-red-500 hover:bg-red-500/10 flex items-center space-x-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>{isLeaving ? "Leaving..." : "Leave"}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {isMember && (
                        <CreateGroupPost
                            groupId={group.id}
                            onPostCreated={() => setRefreshTrigger(prev => prev + 1)}
                        />
                    )}
                    <GroupFeed
                        groupId={group.id}
                        memberRole={userRole}
                        refreshTrigger={refreshTrigger}
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Members */}
                    <div className="card-simple p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold">Members</h3>
                            {canManage && (
                                <button
                                    onClick={() => setIsAddMemberOpen(true)}
                                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                                >
                                    <UserPlus className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {members.slice(0, 5).map((member: any) => (
                                <div key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                                            {member.user?.image ? (
                                                <Image
                                                    src={member.user.image}
                                                    alt={member.user.name || "User"}
                                                    width={40}
                                                    height={40}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-sm font-bold">
                                                    {member.user?.name?.[0] || "?"}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm">
                                                {member.user?.name || "Unknown"}
                                            </div>
                                            <div className="text-xs text-muted capitalize">
                                                {member.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {members.length > 5 && (
                                <Link
                                    href={`/groups/${group.id}/settings`}
                                    className="text-sm text-primary hover:underline w-full text-left block"
                                >
                                    View all {members.length} members
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* About */}
                    <div className="card-simple p-6">
                        <h3 className="font-bold mb-3">About</h3>
                        <div className="space-y-2 text-sm text-muted">
                            <div className="flex items-center space-x-2">
                                <span className="capitalize">{group.visibility}</span>
                                <span>group</span>
                            </div>
                            <div>
                                Created {new Date(group.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Member Modal */}
            <AddMemberModal
                groupId={group.id}
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                onMemberAdded={() => {
                    router.refresh();
                    setIsAddMemberOpen(false);
                }}
            />
        </div>
    );
};
