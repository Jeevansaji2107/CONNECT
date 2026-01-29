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

    socket.on("send-message", (data) => {
        console.log("Message received:", data);
        // Broadcast to room
        io.to(data.room).emit("receive-message", {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            timestamp: new Date().toLocaleTimeString(),
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

const PORT = 3002;
server.listen(PORT, () => {
    console.log(`Real-time server running on port ${PORT}`);
});
