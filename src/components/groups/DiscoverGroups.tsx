"use client";

import { motion } from "framer-motion";
import { Users, Globe, UserPlus, Check, Search, MapPin } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { joinGroup } from "@/lib/actions/group-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DiscoverGroupsProps {
    groups: any[];
    isLoggedIn: boolean;
}

export const DiscoverGroups = ({ groups: initialGroups, isLoggedIn }: DiscoverGroupsProps) => {
    const router = useRouter();
    const [groups, setGroups] = useState(initialGroups);
    const [joiningId, setJoiningId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleJoin = async (groupId: string) => {
        if (!isLoggedIn) {
            toast.error("Please log in to join groups");
            return;
        }

        setJoiningId(groupId);
        const result = await joinGroup(groupId);

        if (result.success) {
            toast.success("Joined group!");
            setGroups(groups.map(g =>
                g.id === groupId ? { ...g, is_member: true } : g
            ));
        } else {
            toast.error(result.error || "Failed to join group");
        }
        setJoiningId(null);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold mb-2">Discover Groups</h1>
                    <p className="text-muted">Find and join public communities</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search groups..."
                        className="w-full pl-10 pr-4 py-2 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            {filteredGroups.length === 0 ? (
                <div className="card-simple p-12 text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 text-muted" />
                    <p className="text-muted">No groups found matching &quot;{searchQuery}&quot;</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGroups.map((group) => (
                        <motion.div
                            key={group.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card-simple p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 overflow-hidden">
                                    {group.avatar ? (
                                        <Image
                                            src={group.avatar}
                                            alt={group.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Users className="w-6 h-6 text-primary" />
                                    )}
                                </div>
                                <Globe className="w-4 h-4 text-muted" />
                            </div>

                            <h3 className="font-bold text-lg mb-2">{group.name}</h3>
                            {group.description && (
                                <p className="text-sm text-muted mb-4 line-clamp-2">{group.description}</p>
                            )}

                            {/* Tags */}
                            {group.tags && group.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {group.tags.map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="px-1.5 py-0.5 bg-secondary text-[8px] font-black uppercase tracking-widest rounded transition-colors hover:bg-primary/10 hover:text-primary"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="flex flex-col gap-1">
                                    <div className="text-sm text-muted">
                                        {group.member_count} {group.member_count === 1 ? "member" : "members"}
                                    </div>
                                    {group.location && (
                                        <div className="flex items-center space-x-1 text-[10px] text-primary/60 font-bold">
                                            <MapPin className="w-3 h-3" />
                                            <span>{group.location}</span>
                                        </div>
                                    )}
                                </div>
                                {group.is_member ? (
                                    <Link
                                        href={`/groups/${group.id}`}
                                        className="btn-outline flex items-center space-x-2 text-sm"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>View</span>
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => handleJoin(group.id)}
                                        disabled={joiningId === group.id}
                                        className="btn-primary flex items-center space-x-2 text-sm"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span>{joiningId === group.id ? "Joining..." : "Join"}</span>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
