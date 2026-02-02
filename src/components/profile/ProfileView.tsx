"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import { PostCard } from "@/components/feed/PostCard";
import { Settings, MapPin, Calendar, Share2, MessageSquare, Grid, Heart } from "lucide-react";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useState } from "react";
import { User, Post } from "@/lib/types";
import { toast } from "sonner";
import { Check, X, Pencil } from "lucide-react";
import { EditProfileDialog } from "./EditProfileDialog";

import { useSession } from "next-auth/react";

interface ProfileViewProps {
    user: User & { _count: { followers: number, following: number } };
    posts: Post[];
    userId: string;
}

export const ProfileView = ({ user, posts, userId }: ProfileViewProps) => {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("posts");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const isOwnProfile = user.id === userId;
    const displayName = (user.email?.toLowerCase() === "maddy@connect.social" || user.name === "Nexus Explorer" || !user.name)
        ? (user.name === "Nexus Explorer" ? "Maddy" : user.name || "Maddy")
        : (user.email?.toLowerCase().includes("jeevansaji2107"))
            ? "JEEVAN SAJI"
            : user.name;

    const userImage = (user.email?.toLowerCase() === "maddy@connect.social" || displayName === "Maddy")
        ? "https://i.pinimg.com/736x/13/f4/ed/13f4ed13e9d297b674b36cff7f8e273f.jpg"
        : (user.email?.toLowerCase().includes("jeevansaji2107"))
            ? ((user.image && !user.image.includes("13f4ed13e9d297b674b36cff7f8e273f"))
                ? user.image
                : "https://i.pinimg.com/736x/a3/27/bf/a327bf02ee0174a438746cc99a1c9e15.jpg")
            : user.image;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header */}
            <div className="card-simple p-0 relative overflow-hidden bg-white dark:bg-card border-none shadow-2xl">
                {/* Modern Cover Backdrop with BMW Banner */}
                <div className="h-48 md:h-64 w-full relative overflow-hidden">
                    {user.email === "maddy@connect.social" || displayName === "Maddy" ? (
                        <Image
                            src="https://i.pinimg.com/1200x/e9/af/cb/e9afcba2d4fee6ae2f2258cd8eb9901e.jpg"
                            alt="Banner"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent">
                            <div className="absolute inset-0 mesh-bg opacity-30" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                </div>

                <div className="px-8 md:px-12 pb-12 -mt-16 md:-mt-20 relative z-10">
                    <div className="flex flex-col md:flex-row items-end md:items-end gap-6 md:gap-10">
                        <div className="relative group">
                            {/* Neural Data Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                className="absolute -inset-4 border-2 border-dashed border-primary/20 rounded-full z-0"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                                className="absolute -inset-2 border-2 border-dashed border-tech-cyan/20 rounded-full z-0"
                            />

                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background shadow-2xl overflow-hidden bg-secondary relative z-10 transition-transform duration-500 group-hover:scale-105">
                                {userImage ? (
                                    <Image src={userImage} alt={displayName} width={160} height={160} className="object-cover h-full w-full" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary text-5xl font-black bg-primary/5">
                                        {displayName[0]}
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        <div className="flex-1 space-y-4 pb-2">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase">{displayName}</h1>
                                    {(user.email === "maddy@connect.social" || user.email === "jeevansaji2107@gmail.com") && (
                                        <div className="bg-primary/10 border border-primary/20 rounded-full p-1.5" title="Official Connect Account">
                                            <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                                <p className="text-primary font-bold tracking-widest text-[10px] uppercase opacity-60">Verified Member</p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs font-bold text-muted uppercase tracking-widest">
                                <span className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                    <MapPin className="w-3.5 h-3.5 text-primary" />
                                    <span>Global Node</span>
                                </span>
                                {(user.email === "jeevansaji2107@gmail.com") && (
                                    <span className="flex items-center space-x-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 text-primary">
                                        <Settings className="w-3.5 h-3.5" />
                                        <span>System Admin</span>
                                    </span>
                                )}
                                <span className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                    <span>Linked {format(user.createdAt ? new Date(user.createdAt) : new Date(), "yyyy")}</span>
                                </span>
                            </div>

                            <div className="pt-2">
                                <div className="group/bio relative">
                                    <p className="text-sm text-foreground/70 font-medium leading-relaxed max-w-xl italic">
                                        {user.bio || "No biological transmission detected."}
                                    </p>
                                    {isOwnProfile && (
                                        <button
                                            onClick={() => setIsEditOpen(true)}
                                            className="absolute -right-8 top-0 opacity-0 group-hover/bio:opacity-100 p-1 text-primary hover:bg-primary/10 rounded-full transition-all"
                                        >
                                            <Pencil className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isOwnProfile && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsEditOpen(true)}
                                    className="btn-primary py-2.5 px-8 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                >
                                    Edit Node
                                </button>
                            </div>
                        )}
                    </div>

                    <EditProfileDialog
                        user={user}
                        isOpen={isEditOpen}
                        onClose={() => setIsEditOpen(false)}
                    />

                    <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 pt-8 border-t border-white/5">
                        <div className="text-center md:text-left space-y-1 group">
                            <p className="text-2xl md:text-3xl font-black text-primary transition-transform group-hover:scale-110 origin-left">
                                {displayName === "Maddy" ? "100.0M" : user._count.followers}
                            </p>
                            <p className="text-[9px] font-bold text-muted uppercase tracking-[0.2em] opacity-50">Followers</p>
                        </div>
                        <div className="text-center md:text-left space-y-1 group">
                            <p className="text-2xl md:text-3xl font-black text-foreground transition-transform group-hover:scale-110 origin-left">
                                {displayName === "Maddy" ? "1" : user._count.following}
                            </p>
                            <p className="text-[9px] font-bold text-muted uppercase tracking-[0.2em] opacity-50">Following</p>
                        </div>
                        <div className="text-center md:text-left space-y-1 group">
                            <p className="text-2xl md:text-3xl font-black text-foreground transition-transform group-hover:scale-110 origin-left">
                                {posts.length}
                            </p>
                            <p className="text-[9px] font-bold text-muted uppercase tracking-[0.2em] opacity-50">Transmissions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="space-y-6">
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setActiveTab("posts")}
                        className={`flex items-center space-x-2 px-8 py-4 text-sm font-bold transition-all relative ${activeTab === "posts" ? "text-primary" : "text-muted hover:text-foreground"}`}
                    >
                        <Grid className="w-4 h-4" />
                        <span>Posts</span>
                        {activeTab === "posts" && (
                            <motion.div layoutId="profile-active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("likes")}
                        className={`flex items-center space-x-2 px-8 py-4 text-sm font-bold transition-all relative ${activeTab === "likes" ? "text-primary" : "text-muted hover:text-foreground"}`}
                    >
                        <Heart className="w-4 h-4" />
                        <span>Likes</span>
                        {activeTab === "likes" && (
                            <motion.div layoutId="profile-active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                </div>

                <div className="max-w-3xl mx-auto">
                    <ErrorBoundary>
                        <AnimatePresence mode="wait">
                            {activeTab === "posts" ? (
                                <motion.div
                                    key="posts"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    {posts.length > 0 ? (
                                        posts.map((post: Post) => (
                                            <PostCard key={post.id} post={post} />
                                        ))
                                    ) : (
                                        <div className="text-center py-20 card-simple border-dashed">
                                            <p className="text-muted font-medium">No posts yet.</p>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="likes"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-center py-20 card-simple border-dashed"
                                >
                                    <Heart className="w-12 h-12 mx-auto mb-4 text-muted/20" />
                                    <p className="text-muted font-medium">No liked posts yet.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};
