"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, UserPlus, Loader2 } from "lucide-react";
import { searchUsers } from "@/lib/actions/user-actions";
import { addGroupMember } from "@/lib/actions/group-actions";
import { toast } from "sonner";
import Image from "next/image";

interface AddMemberModalProps {
    groupId: string;
    isOpen: boolean;
    onClose: () => void;
    onMemberAdded?: () => void;
}

export const AddMemberModal = ({ groupId, isOpen, onClose, onMemberAdded }: AddMemberModalProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"admin" | "moderator" | "member">("member");

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        const result = await searchUsers(query);
        if (result.success && result.users) {
            setSearchResults(result.users);
        }
        setIsSearching(false);
    };

    const handleAddMember = async (userId: string) => {
        const result = await addGroupMember(groupId, userId, selectedRole);

        if (result.success) {
            toast.success("Member added successfully!");
            onMemberAdded?.();
            onClose();
        } else {
            toast.error(result.error || "Failed to add member");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl z-50 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Add Member</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-secondary rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search users by name or email..."
                                className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="mb-4">
                            <label className="text-sm text-muted mb-2 block">Role</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value as any)}
                                className="w-full px-4 py-3 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="member">Member</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* Results */}
                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {isSearching && (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            )}
                            {!isSearching && searchResults.length === 0 && searchQuery.length >= 2 && (
                                <div className="text-center py-8 text-muted">
                                    No users found
                                </div>
                            )}
                            {searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                                            {user.image ? (
                                                <Image
                                                    src={user.image}
                                                    alt={user.name || "User"}
                                                    width={40}
                                                    height={40}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-sm font-bold">
                                                    {user.name?.[0] || "?"}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{user.name || "Unknown"}</div>
                                            <div className="text-xs text-muted">{user.email}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAddMember(user.id)}
                                        className="btn-primary flex items-center space-x-2 text-sm"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span>Add</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
