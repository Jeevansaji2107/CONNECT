"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Lock, Globe, MapPin } from "lucide-react";
import type { Group } from "@/lib/actions/group-actions";
import Image from "next/image";

interface GroupCardProps {
    group: Group;
}

export const GroupCard = ({ group }: GroupCardProps) => {
    return (
        <Link href={`/groups/${group.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="card-simple p-6 cursor-pointer"
            >
                <div className="flex items-start space-x-4">
                    {/* Group Avatar */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
                        {group.avatar ? (
                            <Image
                                src={group.avatar}
                                alt={group.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Users className="w-8 h-8 text-primary" />
                        )}
                    </div>

                    {/* Group Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-bold truncate">{group.name}</h3>
                            {group.visibility === "private" ? (
                                <Lock className="w-4 h-4 text-muted shrink-0" />
                            ) : (
                                <Globe className="w-4 h-4 text-muted shrink-0" />
                            )}
                        </div>

                        {group.description && (
                            <p className="text-sm text-muted line-clamp-2 mb-3">
                                {group.description}
                            </p>
                        )}

                        {/* Tags */}
                        {group.tags && group.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                                {group.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="px-1.5 py-0.5 bg-secondary text-[8px] font-black uppercase tracking-widest rounded"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-muted">
                            {group.location && (
                                <div className="flex items-center space-x-1">
                                    <MapPin className="w-3.5 h-3.5 text-primary" />
                                    <span className="font-semibold">{group.location}</span>
                                </div>
                            )}
                            <div className="flex items-center space-x-1">
                                <Users className="w-3.5 h-3.5" />
                                <span className="font-semibold">
                                    {group.member_count} {group.member_count === 1 ? "member" : "members"}
                                </span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-muted" />
                            <span className="capitalize">{group.visibility}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};
