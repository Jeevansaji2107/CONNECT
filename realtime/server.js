const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("send-message", async (data) => {
        console.log("Message received:", data);

        // Broadcast to specific room (conversation)
        // Ensure room ID corresponds to the conversation pair
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
    });
});

const PORT = 3004;
server.listen(PORT, () => {
    console.log(`Real-time server running on port ${PORT}`);
});
