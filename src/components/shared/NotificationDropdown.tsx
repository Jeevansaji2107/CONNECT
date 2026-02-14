"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Info, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useChatStore } from "@/lib/store";

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [notifications, setNotifications] = useState([] as any[]);
    const [isLoading, setIsLoading] = useState(true);
    const setNotificationCount = useChatStore((state: any) => state.setNotificationCount);

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

    useEffect(() => {
        if (isOpen) {
            const fetchNotifs = async () => {
                setIsLoading(true);
                const { getNotifications } = await import("@/lib/actions/notification-actions");
                const result = await getNotifications();
                if (result.success) {
                    setNotifications(result.data || []);
                }
                setIsLoading(false);
            };
            fetchNotifs();
        }
    }, [isOpen]);

    const handleMarkAllAsRead = async () => {
        const { markNotificationsAsRead } = await import("@/lib/actions/notification-actions");
        const result = await markNotificationsAsRead();
        if (result.success) {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setNotificationCount(0);
        }
    };

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
                        {isLoading ? (
                            <div className="p-8 text-center">
                                <p className="text-xs text-muted animate-pulse">Synchronizing feeds...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {notifications.map((notif: any) => (
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
                                                        {formatDistanceToNow(new Date(notif.created_at || notif.createdAt))} ago
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
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-primary-hover transition-colors"
                        >
                            Mark all as read
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
