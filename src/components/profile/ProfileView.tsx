"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import { PostCard } from "@/components/feed/PostCard";
import { Settings, MapPin, Calendar, Share2, MessageSquare, Grid, Heart } from "lucide-react";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useState } from "react";
import { User, Post } from "@/lib/types";

interface ProfileViewProps {
    user: User & { _count: { followers: number, following: number } };
    posts: Post[];
    userId: string;
}

export const ProfileView = ({ user, posts, userId }: ProfileViewProps) => {
    const [activeTab, setActiveTab] = useState("posts");

    const displayName = (user.name === "Nexus Explorer" || !user.name) ? "Connect Visionary" : user.name;
    const userImage = user.email === "maddy@connect.social" ? "/avatars/maddy.png" : user.image;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header */}
            <div className="card-simple p-0 relative overflow-hidden bg-white dark:bg-card border-none shadow-2xl">
                {/* Modern Cover Backdrop */}
                <div className="h-32 md:h-48 w-full bg-gradient-to-r from-primary/20 via-primary/5 to-transparent relative">
                    <div className="absolute inset-0 mesh-bg opacity-30" />
                </div>

                <div className="px-8 md:px-12 pb-12 -mt-16 md:-mt-20 relative z-10">
                    <div className="flex flex-col md:flex-row items-end md:items-end gap-6 md:gap-10">
                        <div className="relative group">
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
                                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase">{displayName}</h1>
                                <p className="text-primary font-bold tracking-widest text-[10px] uppercase opacity-60">Verified Member</p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs font-bold text-muted uppercase tracking-widest">
                                <span className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                    <MapPin className="w-3.5 h-3.5 text-primary" />
                                    <span>Global Node</span>
                                </span>
                                <span className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                    <span>Linked {format(user.createdAt ? new Date(user.createdAt) : new Date(), "yyyy")}</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="btn-primary py-2.5 px-8 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                Edit Node
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 pt-8 border-t border-white/5">
                        <div className="text-center md:text-left space-y-1 group">
                            <p className="text-2xl md:text-3xl font-black text-primary transition-transform group-hover:scale-110 origin-left">
                                {user.email === "maddy@connect.social" ? "100.0M" : user._count.followers}
                            </p>
                            <p className="text-[9px] font-bold text-muted uppercase tracking-[0.2em] opacity-50">Followers</p>
                        </div>
                        <div className="text-center md:text-left space-y-1 group">
                            <p className="text-2xl md:text-3xl font-black text-foreground transition-transform group-hover:scale-110 origin-left">
                                {user.email === "maddy@connect.social" ? "1" : user._count.following}
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
