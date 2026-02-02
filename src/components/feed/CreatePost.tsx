"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, Send, X, Smile, MapPin, Globe, Users, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
import { createPost } from "@/lib/actions/post-actions";
import { Logo } from "@/components/shared/Logo";

export const CreatePost = () => {
    const { data: session } = useSession();
    const [content, setContent] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [location, setLocation] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showLocationInput, setShowLocationInput] = useState(false);
    const [visibility, setVisibility] = useState<"public" | "followers" | "private">("public");
    const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const emojis = ["🚀", "✨", "💻", "🔥", "⚡", "🤖", "🎨", "🌐"];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addEmoji = (emoji: string) => {
        setContent(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !image) return;

        setIsUploading(true);
        try {
            // Include location in content for now if schema doesn't support it directly
            const postContent = location ? `${content}\n\n📍 ${location}` : content;
            const result = await createPost(postContent, image ? [image] : [], visibility);
            if (result.success) {
                setContent("");
                setImage(null);
                setLocation("");
                setShowLocationInput(false);
                toast.success("Post created successfully!");
            } else {
                toast.error(result.error || "Failed to create post");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsUploading(false);
        }
    };

    const [isFocused, setIsFocused] = useState(false);

    if (!session) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
                opacity: 1,
                y: 0,
                borderColor: isFocused ? "var(--primary)" : "var(--border)",
                boxShadow: isFocused ? "0 0 30px rgba(59, 130, 246, 0.1)" : "none"
            }}
            className="card-simple p-6 mb-8 bg-card transition-colors duration-500"
        >
            <div className="flex justify-between items-start mb-4">
                <Logo size="sm" />
                <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] opacity-40">System Uplink</div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-secondary border border-border shrink-0">
                        {session.user.email?.toLowerCase() === "maddy@connect.social" ? (
                            <Image src="https://i.pinimg.com/736x/13/f4/ed/13f4ed13e9d297b674b36cff7f8e273f.jpg" alt="" fill className="object-cover" priority />
                        ) : (session.user.email?.toLowerCase().includes("jeevansaji2107")) ? (
                            <Image src={session.user.image || "https://i.pinimg.com/736x/a3/27/bf/a327bf02ee0174a438746cc99a1c9e15.jpg"} alt="" fill className="object-cover" />
                        ) : session.user.image ? (
                            <Image src={session.user.image} alt="" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                                {session.user.name?.[0]}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="What's on your mind?"
                            className="w-full bg-transparent border-none outline-none resize-none text-lg text-foreground placeholder:text-muted py-2 min-h-[100px]"
                        />

                        {/* Visibility Selector */}
                        <div className="relative inline-block">
                            <button
                                type="button"
                                onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-secondary/50 hover:bg-secondary rounded-full border border-border/50 text-xs font-bold text-muted hover:text-foreground transition-all"
                            >
                                {visibility === "public" && <><Globe className="w-3.5 h-3.5" /> <span>Public</span></>}
                                {visibility === "followers" && <><Users className="w-3.5 h-3.5" /> <span>Followers</span></>}
                            </button>

                            <AnimatePresence>
                                {showVisibilityMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="absolute left-0 bottom-full mb-2 bg-card border border-border rounded-xl shadow-2xl overflow-auto z-[100] min-w-[180px] max-h-[300px]"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => { setVisibility("public"); setShowVisibilityMenu(false); }}
                                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-primary/10 text-foreground text-sm font-medium transition-all"
                                        >
                                            <Globe className="w-4 h-4 text-primary" />
                                            <div className="text-left">
                                                <p className="font-bold">Public</p>
                                                <p className="text-[10px] text-muted">Everyone can see</p>
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setVisibility("followers"); setShowVisibilityMenu(false); }}
                                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-primary/10 text-foreground text-sm font-medium transition-all"
                                        >
                                            <Users className="w-4 h-4 text-primary" />
                                            <div className="text-left">
                                                <p className="font-bold">Followers</p>
                                                <p className="text-[10px] text-muted">Only followers</p>
                                            </div>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {showLocationInput && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center space-x-2 text-xs text-primary font-bold bg-primary/5 p-2 rounded-lg border border-primary/10 mt-2"
                            >
                                <MapPin className="w-3 h-3" />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Enter location..."
                                    className="bg-transparent border-none outline-none flex-1 placeholder:text-primary/40 uppercase tracking-widest"
                                    autoFocus
                                />
                                <button type="button" onClick={() => { setLocation(""); setShowLocationInput(false); }}>
                                    <X className="w-3 h-3" />
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {showEmojiPicker && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex gap-2 p-2 bg-secondary rounded-xl"
                        >
                            {emojis.map(e => (
                                <button
                                    key={e}
                                    type="button"
                                    onClick={() => addEmoji(e)}
                                    className="text-xl hover:scale-125 transition-transform p-1"
                                >
                                    {e}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {image && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative aspect-video rounded-2xl overflow-hidden border border-border group"
                        >
                            <Image src={image} alt="Upload preview" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => setImage(null)}
                                className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all backdrop-blur-md"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2.5 text-primary hover:bg-primary/10 rounded-full transition-all"
                            title="Add Image"
                        >
                            <ImageIcon className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={`p-2.5 rounded-full transition-all ${showEmojiPicker ? "bg-primary text-white" : "text-muted hover:bg-secondary"}`}
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowLocationInput(!showLocationInput)}
                            className={`p-2.5 rounded-full transition-all ${showLocationInput ? "bg-primary text-white" : "text-muted hover:bg-secondary"}`}
                        >
                            <MapPin className="w-5 h-5" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isUploading || (!content.trim() && !image)}
                        className="btn-primary py-2 px-8 font-bold"
                    >
                        {isUploading ? "Posting..." : "Post"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};
