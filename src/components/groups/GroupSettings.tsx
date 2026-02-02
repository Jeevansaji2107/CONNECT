"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Trash2, UserMinus, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateGroup, deleteGroup, removeGroupMember, updateMemberRole } from "@/lib/actions/group-actions";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

interface GroupSettingsProps {
    group: any;
    members: any[];
    currentUserId: string;
    userRole: string;
}

export const GroupSettings = ({ group, members, currentUserId, userRole }: GroupSettingsProps) => {
    const router = useRouter();
    const [name, setName] = useState(group.name);
    const [description, setDescription] = useState(group.description || "");
    const [visibility, setVisibility] = useState<"public" | "private">(group.visibility);
    const [avatar, setAvatar] = useState(group.avatar || "");
    const [coverImage, setCoverImage] = useState(group.cover_image || "");
    const [tags, setTags] = useState(group.tags?.join(", ") || "");
    const [location, setLocation] = useState(group.location || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = userRole === "owner";

    const handleSave = async () => {
        setIsSaving(true);
        const tagsArray = tags.split(",").map((t: string) => t.trim()).filter((t: string) => t !== "");
        const result = await updateGroup(group.id, {
            name,
            description,
            visibility,
            avatar,
            cover_image: coverImage,
            tags: tagsArray,
            location
        });

        if (result.success) {
            toast.success("Group updated successfully!");
            router.push(`/groups/${group.id}`);
        } else {
            toast.error(result.error || "Failed to update group");
        }
        setIsSaving(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        const result = await deleteGroup(group.id);

        if (result.success) {
            toast.success("Group deleted");
            router.push("/groups");
        } else {
            toast.error(result.error || "Failed to delete group");
            setIsDeleting(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!confirm("Remove this member from the group?")) return;

        const result = await removeGroupMember(group.id, userId);
        if (result.success) {
            toast.success("Member removed");
            router.refresh();
        } else {
            toast.error(result.error || "Failed to remove member");
        }
    };

    const handleChangeRole = async (userId: string, newRole: "admin" | "moderator" | "member") => {
        const result = await updateMemberRole(group.id, userId, newRole);
        if (result.success) {
            toast.success("Role updated");
            router.refresh();
        } else {
            toast.error(result.error || "Failed to update role");
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto">
            <Link
                href={`/groups/${group.id}`}
                className="inline-flex items-center space-x-2 text-muted hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to group</span>
            </Link>

            <h1 className="text-3xl font-extrabold mb-8">Group Settings</h1>

            <div className="space-y-8">
                {/* Basic Info */}
                <div className="card-simple p-6">
                    <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-muted mb-2">Group Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-2">Visibility</label>
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value as any)}
                                className="w-full px-4 py-3 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="public">Public - Anyone can join</option>
                                <option value="private">Private - Invite only</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Branding */}
                <div className="card-simple p-6">
                    <h2 className="text-xl font-bold mb-4">Branding & Identity</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-muted mb-2">Avatar URL</label>
                            <input
                                type="text"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full px-4 py-3 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-2">Cover Image URL</label>
                            <input
                                type="text"
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                placeholder="https://example.com/cover.jpg"
                                className="w-full px-4 py-3 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-2">Geolocation</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City, Country"
                                className="w-full px-4 py-3 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-2">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="developer, tech, community"
                                className="w-full px-4 py-3 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Members Management */}
                <div className="card-simple p-6">
                    <h2 className="text-xl font-bold mb-4">Members ({members.length})</h2>
                    <div className="space-y-3">
                        {members.map((member: any) => (
                            <div key={member.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors">
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
                                        <div className="font-semibold">{member.user?.name || "Unknown"}</div>
                                        <div className="text-xs text-muted capitalize">{member.role}</div>
                                    </div>
                                </div>
                                {member.user_id !== currentUserId && member.role !== "owner" && (
                                    <div className="flex items-center space-x-2">
                                        {isOwner && (
                                            <select
                                                value={member.role}
                                                onChange={(e) => handleChangeRole(member.user_id, e.target.value as any)}
                                                className="px-3 py-1 bg-secondary rounded-lg text-sm"
                                            >
                                                <option value="member">Member</option>
                                                <option value="moderator">Moderator</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        )}
                                        <button
                                            onClick={() => handleRemoveMember(member.user_id)}
                                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-full transition-colors"
                                        >
                                            <UserMinus className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danger Zone */}
                {isOwner && (
                    <div className="card-simple p-6 border-red-500/20">
                        <h2 className="text-xl font-bold mb-4 text-red-500">Danger Zone</h2>
                        <p className="text-muted mb-4">
                            Once you delete a group, there is no going back. Please be certain.
                        </p>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="btn-outline border-red-500 text-red-500 hover:bg-red-500/10 flex items-center space-x-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>{isDeleting ? "Deleting..." : "Delete Group"}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Global Save Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary flex items-center space-x-3 shadow-2xl px-8"
                >
                    <Save className="w-5 h-5" />
                    <span className="font-bold">{isSaving ? "Saving..." : "Save All Changes"}</span>
                </button>
            </div>
        </div>
    );
};
