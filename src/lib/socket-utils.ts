import { io } from "socket.io-client";

const socket = io("http://localhost:3002", {
    transports: ["websocket"], // Force websocket for server-side
});

export const triggerNotification = (targetUserId: string, data: { title: string; message: string; icon?: string }) => {
    try {
        socket.emit("send-notification", {
            targetRoom: `user-${targetUserId}`,
            ...data,
        });
    } catch (error) {
        console.error("Failed to trigger real-time notification:", error);
    }
};
