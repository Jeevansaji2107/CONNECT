"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { Send, User, Search, MoreVertical, Phone, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface Message {
    room: string;
    userId: string;
    userName: string;
    userImage?: string | null;
    content: string;
    timestamp: string;
}

interface Contact {
    id: string;
    name: string;
    image: string | null;
    status: "online" | "offline";
    lastMsg: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<Contact | null>(null);
    const { data: session } = useSession();
    const socketRef = useRef<ReturnType<typeof io> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const mockContacts: Contact[] = [
        { id: "user-1", name: "Sarah Williams", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", status: "online", lastMsg: "See you there!" },
        { id: "user-2", name: "Jack Wilson", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack", status: "online", lastMsg: "The proposal looks good." },
        { id: "user-3", name: "Elena Rodriguez", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena", status: "offline", lastMsg: "Thanks!" },
        { id: "user-4", name: "Zion Miller", image: null, status: "online", lastMsg: "Joined the call." },
    ];

    useEffect(() => {
        if (!session?.user) return;

        socketRef.current = io("http://localhost:3002");
        socketRef.current.emit("join-room", "global-connection");

        socketRef.current.on("receive-message", (msg: Message) => {
            setMessages(prev => [...prev, msg]);
            setTypingUser(null);
        });

        socketRef.current.on("user-typing", (data: { userId: string, userName?: string }) => {
            if (data.userId !== session.user?.id) {
                setTypingUser(data.userId === selectedUser?.id ? data.userName || "Someone" : null);
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
            }
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [session, selectedUser]);

    useEffect(() => {
        if (socketRef.current && selectedUser && session?.user) {
            const room = [session.user.id, selectedUser.id].sort().join("--");
            socketRef.current.emit("join-room", room);
            setTimeout(() => setMessages([]), 0);
        }
    }, [selectedUser, session]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !session?.user || !selectedUser) return;
        const room = [session.user.id, selectedUser.id].sort().join("--");
        const msg: Message = {
            room,
            userId: session.user.id,
            userName: session.user.name || "Anonymous",
            userImage: session.user.image,
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        if (socketRef.current) {
            socketRef.current.emit("send-message", msg);
        }
        setInput("");
    };

    return (
        <div className="h-[calc(100vh-120px)] flex max-w-6xl mx-auto overflow-hidden bg-card border border-border rounded-3xl shadow-sm">
            {/* Sidebar: Contacts */}
            <div className="w-80 border-r border-border flex flex-col bg-background/50">
                <div className="p-6 border-b border-border space-y-4">
                    <h2 className="text-xl font-bold tracking-tight">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            placeholder="Search messages"
                            className="w-full bg-secondary rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 ring-primary/20"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {mockContacts.map((contact) => (
                        <button
                            key={contact.id}
                            onClick={() => setSelectedUser(contact)}
                            className={`w-full flex items-center space-x-3 p-4 transition-all ${selectedUser?.id === contact.id ? "bg-primary/5 border-r-4 border-primary" : "hover:bg-secondary/50"}`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden border border-border">
                                    {contact.image ? (
                                        <Image src={contact.image} alt="" width={48} height={48} className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-primary font-bold">{contact.name[0]}</div>
                                    )}
                                </div>
                                {contact.status === "online" && (
                                    <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-background bg-green-500" />
                                )}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-bold text-foreground">{contact.name}</p>
                                <p className="text-xs text-muted truncate">{contact.lastMsg}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main: Chat Window */}
            <div className="flex-1 flex flex-col bg-background">
                {selectedUser ? (
                    <>
                        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary border border-border overflow-hidden">
                                    {selectedUser.image ? (
                                        <Image src={selectedUser.image} alt="" width={40} height={40} className="object-cover" />
                                    ) : (
                                        selectedUser.name[0]
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{selectedUser.name}</div>
                                    <div className="text-[10px] text-muted font-medium">
                                        {selectedUser.status === "online" ? "Active now" : "Offline"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2.5 text-muted hover:bg-secondary rounded-full transition-all">
                                    <Phone className="w-4.5 h-4.5" />
                                </button>
                                <button className="p-2.5 text-muted hover:bg-secondary rounded-full transition-all">
                                    <Video className="w-4.5 h-4.5" />
                                </button>
                                <button className="p-2.5 text-muted hover:bg-secondary rounded-full transition-all">
                                    <MoreVertical className="w-4.5 h-4.5" />
                                </button>
                            </div>
                        </div>

                        <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
                            {messages.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 opacity-40">
                                    <MessageSquare className="w-12 h-12 mb-2" />
                                    <p className="text-xs font-bold">No messages yet</p>
                                    <p className="text-[10px]">Start a conversation with {selectedUser.name}</p>
                                </div>
                            )}
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`flex ${msg.userId === session?.user?.id ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[70%] space-y-1`}>
                                            <div className={`p-3 px-5 rounded-2xl text-sm ${msg.userId === session?.user?.id
                                                ? "bg-primary text-white rounded-tr-none"
                                                : "bg-secondary text-foreground rounded-tl-none border border-border"
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <p className={`text-[10px] text-muted ${msg.userId === session?.user?.id ? "text-right" : "text-left"}`}>
                                                {msg.timestamp}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {typingUser && (
                                <p className="text-[10px] text-muted italic ml-2 animate-pulse">{typingUser} is typing...</p>
                            )}
                        </div>

                        <div className="p-6 bg-background border-t border-border">
                            <div className="flex items-center space-x-3 bg-secondary p-2 px-4 rounded-2xl">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none py-2 text-sm outline-none placeholder:text-muted/60"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim()}
                                    className="bg-primary hover:bg-primary-hover p-2 rounded-xl transition-all disabled:opacity-50"
                                >
                                    <Send className="w-4.5 h-4.5 text-white" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                            <User className="w-8 h-8 text-muted/40" />
                        </div>
                        <h3 className="text-lg font-bold">Direct Messages</h3>
                        <p className="text-sm text-muted max-w-xs">Select a contact from the left to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const MessageSquare = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);
