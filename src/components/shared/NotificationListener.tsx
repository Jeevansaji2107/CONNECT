"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { useChatStore } from "@/lib/store";
import { usePathname } from "next/navigation";

export const NotificationListener = () => {
    const { data: session } = useSession();
    const incrementUnread = useChatStore((state) => state.incrementUnread);
    const pathname = usePathname();

    useEffect(() => {
        if (!session?.user?.id) return;

        const socket = io("http://localhost:3004");

        // Join global user room
        socket.emit("join-room", `user-${session.user.id}`);

        // Join all conversation rooms for this user
        // This is necessary if we want to receive messages even when not on the chat page
        // Alternatively, the server can broadcast to user-${id} room for notifications

        socket.on("receive-message", (msg: any) => {
            // If not on chat page, increment unread count and show toast
            if (pathname !== "/chat") {
                if (msg.userId !== session.user.id) {
                    incrementUnread();
                    toast(`Message from ${msg.userName}`, {
                        description: msg.content,
                        action: {
                            label: "View",
                            onClick: () => window.location.href = "/chat"
                        },
                    });
                }
            }
        });

        socket.on("notification", (data: { title: string; message: string; icon?: string }) => {
            toast(data.title, {
                description: data.message,
                icon: data.icon || "🔔",
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [session, pathname, incrementUnread]);

    return null;
};
