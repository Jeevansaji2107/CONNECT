"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, Send, X, Smile, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
import { createPost } from "@/lib/actions/post-actions";

export const CreatePost = () => {
    const { data: session } = useSession();
    const [content, setContent] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !image) return;

        setIsUploading(true);
        try {
            const result = await createPost(content, image ? [image] : []);
            if (result.success) {
                setContent("");
                setImage(null);
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
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-secondary border border-border shrink-0">
                        {session.user.image ? (
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
                    </div>
                </div>

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
                        <button type="button" className="p-2.5 text-muted hover:bg-secondary rounded-full transition-all">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button type="button" className="p-2.5 text-muted hover:bg-secondary rounded-full transition-all">
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
