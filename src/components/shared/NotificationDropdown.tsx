"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Info, X } from "lucide-react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useChatStore } from "@/lib/store";

interface Notification {
    id: string;
    type: "like" | "comment" | "follow" | "system";
    title: string;
    message: string;
    createdAt: Date;
    read: boolean;
    image?: string;
}

// Temporary mock data until backend notifications are fully hooked up
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        type: "system",
        title: "System Update",
        message: "Connect v3.3 protocols activated. Vault synchronization complete.",
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
        read: false,
    },
    {
        id: "2",
        type: "follow",
        title: "New Follower",
        message: "Nexus Explorer started following you.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true,
        image: "https://i.pinimg.com/736x/13/f4/ed/13f4ed13e9d297b674b36cff7f8e273f.jpg"
    },
    {
        id: "3",
        type: "like",
        title: "Post Liked",
        message: "Your post 'Neural networks are...' received 24 likes.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
    }
];

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const unreadCount = useChatStore((state) => state.unreadCount); // Reusing chat store for now
    const resetUnread = useChatStore((state) => state.resetUnread);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Mark as read when opened (simplified logic)
    useEffect(() => {
        if (isOpen && unreadCount > 0) {
            // resetUnread(); // Optional: Uncomment to clear badge on open
        }
    }, [isOpen, unreadCount, resetUnread]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#020617]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.4)] overflow-hidden z-[50]"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                        <div className="flex items-center space-x-2">
                            <Bell className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold uppercase tracking-wider text-foreground">Notifications</span>
                        </div>
                        <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* List */}
                    <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {MOCK_NOTIFICATIONS.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {MOCK_NOTIFICATIONS.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer group relative ${!notif.read ? "bg-primary/5" : ""}`}
                                    >
                                        {!notif.read && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                        )}
                                        <div className="flex items-start space-x-3">
                                            <div className="relative shrink-0 w-10 h-10 rounded-full overflow-hidden bg-secondary border border-white/10">
                                                {notif.image ? (
                                                    <Image src={notif.image} alt="" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                                        <Info className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-bold text-foreground">{notif.title}</p>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {formatDistanceToNow(notif.createdAt)} ago
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {notif.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto text-muted">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <p className="text-sm text-muted">No new notifications</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-white/5 bg-white/5 text-center">
                        <button className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-primary-hover transition-colors">
                            Mark all as read
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
