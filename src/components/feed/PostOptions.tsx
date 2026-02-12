"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Trash2, Link as LinkIcon, Flag, EyeOff, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface PostOptionsProps {
    isOwner: boolean;
    postId: string;
    onDelete?: () => void;
}

export const PostOptions = ({ isOwner, postId, onDelete }: PostOptionsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const copyLink = () => {
        const url = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
        setIsOpen(false);
    };

    const handleReport = () => {
        toast.success("Post flagged for review");
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-all ${isOpen ? "bg-secondary text-foreground" : "text-muted hover:text-foreground hover:bg-secondary"}`}
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-[#020617] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 backdrop-blur-xl"
                    >
                        <div className="p-1 space-y-1">
                            <button
                                onClick={copyLink}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors text-left"
                            >
                                <LinkIcon className="w-4 h-4" />
                                <span>Copy Link</span>
                            </button>

                            {!isOwner && (
                                <button
                                    onClick={handleReport}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors text-left"
                                >
                                    <Flag className="w-4 h-4" />
                                    <span>Report Post</span>
                                </button>
                            )}

                            {isOwner && onDelete && (
                                <>
                                    <div className="h-px bg-white/5 my-1" />
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            onDelete();
                                        }}
                                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete Post</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
