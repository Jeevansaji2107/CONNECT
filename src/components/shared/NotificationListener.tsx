"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export const NotificationListener = () => {
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user?.id) return;

        const socket = io("http://localhost:3002");

        // Join a room specific to the logged-in user for notifications
        socket.emit("join-room", `user-${session.user.id}`);

        socket.on("notification", (data: { title: string; message: string; icon?: string }) => {
            console.log("Notification received:", data);
            toast(data.title, {
                description: data.message,
                icon: data.icon || "🔔",
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [session]);

    return null; // This component doesn't render anything visible
};
