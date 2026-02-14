const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST"],
    },
});

const onlineUsers = new Map(); // userId -> Set of socketIds

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);

        // Track user presence if joining user room
        if (room.startsWith("user-")) {
            const userId = room.replace("user-", "");
            if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, new Set());
            }
            onlineUsers.get(userId).add(socket.id);
            socket.userId = userId;

            // Broadcast update
            io.emit("presence-update", Array.from(onlineUsers.keys()));
        }
    });

    socket.on("send-message", async (data) => {
        console.log("Message received:", data);

        // Broadcast global activity to HUD
        io.emit("global-activity", {
            type: "MESSAGE",
            userName: data.userName,
            timestamp: Date.now()
        });

        // Broadcast to specific room (conversation)
        io.to(data.room).emit("receive-message", {
            ...data,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
    });

    socket.on("typing", (data) => {
        socket.to(data.room).emit("user-typing", data);
    });

    socket.on("send-notification", (data) => {
        console.log("Notification event:", data);
        io.to(data.targetRoom).emit("notification", {
            title: data.title,
            message: data.message,
            icon: data.icon,
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        if (socket.userId) {
            const userSockets = onlineUsers.get(socket.userId);
            if (userSockets) {
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    onlineUsers.delete(socket.userId);
                }
            }
            io.emit("presence-update", Array.from(onlineUsers.keys()));
        }
    });
});

const PORT = 3004;
server.listen(PORT, () => {
    console.log(`Real-time server running on port ${PORT}`);
});
