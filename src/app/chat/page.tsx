"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { MessageCircle, Send, Search, Phone, Video, MoreVertical, Check, BadgeInfo, X, UserSearch } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { PlexusBackground } from "@/components/chat/PlexusBackground";
import { getMessages, sendMessage, getUsersForChat, searchUsers, getUserById } from "@/lib/actions/chat-actions";
import { useChatStore } from "@/lib/store";
import { toast } from "sonner";


interface Message {
    id?: string;
    room: string;
    userId: string;
    sender_id?: string; // DB field
    userName: string;
    userImage?: string | null;
    content: string;
    timestamp: string;
    created_at?: string;
}

interface Contact {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
    status?: "online" | "offline";
    lastMsg?: string | null;
    last_msg_time?: string | null;
}

export default function ChatPage() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedUser, setSelectedUser] = useState<Contact | null>(null);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [searchResults, setSearchResults] = useState<Contact[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const socketRef = useRef<ReturnType<typeof io> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { resetUnread } = useChatStore();

    // Handle auto-selection from query param
    useEffect(() => {
        const userId = searchParams.get("userId");
        if (userId && session?.user) {
            const fetchUser = async () => {
                const res = await getUserById(userId);
                if (res.success && res.data) {
                    setSelectedUser(res.data);
                }
            };
            fetchUser();
        }
    }, [searchParams, session]);

    // Handle search logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim().length > 1) {
                setIsSearching(true);
                const res = await searchUsers(searchQuery);
                if (res.success && res.data) {
                    setSearchResults(res.data);
                }
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Filter and SORT contacts based on search and time
    const filteredContacts = useMemo(() => {
        const filtered = contacts.filter(c =>
            (c.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (c.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
        );

        // Sort by last_msg_time descending
        return [...filtered].sort((a, b) => {
            const timeA = a.last_msg_time ? new Date(a.last_msg_time).getTime() : 0;
            const timeB = b.last_msg_time ? new Date(b.last_msg_time).getTime() : 0;
            return timeB - timeA;
        });
    }, [contacts, searchQuery]);

    // Reset unread count when viewing chat
    useEffect(() => {
        resetUnread();
    }, [resetUnread]);

    // Initialize Socket and fetch Users
    useEffect(() => {
        if (!session?.user) return;

        // Fetch users
        const fetchUsers = async () => {
            setIsLoadingUsers(true);
            try {
                const res = await getUsersForChat();
                if (res.success && res.data) {
                    setContacts(res.data);
                }
            } catch (error) {
                console.error("Failed to load contacts", error);
            } finally {
                setIsLoadingUsers(false);
            }
        };
        fetchUsers();

        // Connect Socket
        socketRef.current = io("http://localhost:3004");

        socketRef.current.on("receive-message", (msg: Message) => {
            // 1. Update messages if in current room
            const currentRoomId = selectedUser ? [session.user.id, selectedUser.id].sort().join("_") : null;

            if (msg.room === currentRoomId) {
                if (msg.userId !== session.user.id) {
                    setMessages(prev => [...prev, msg]);
                }
            } else if (msg.userId !== session.user.id) {
                toast.info(`New message from ${msg.userName} `);
            }

            // 2. Update contact list (to move it to top)
            setContacts(prev => {
                const newContacts = [...prev];
                // Find potential sender (matching the userId or room logic)
                const roomParts = msg.room.split("_");
                const otherId = roomParts.find(id => id !== session.user.id);

                const index = newContacts.findIndex(c => c.id === otherId);
                if (index !== -1) {
                    const updatedContact = {
                        ...newContacts[index],
                        lastMsg: msg.content,
                        last_msg_time: new Date().toISOString()
                    };
                    newContacts.splice(index, 1);
                    newContacts.unshift(updatedContact);
                }
                return newContacts;
            });
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [session, selectedUser]);

    // Load conversation when user is selected
    useEffect(() => {
        if (!selectedUser || !session?.user) return;

        const roomId = [session.user.id, selectedUser.id].sort().join("_");

        // Join room
        if (socketRef.current) {
            socketRef.current.emit("join-room", roomId);
        }

        // Fetch history
        const loadHistory = async () => {
            const res = await getMessages(selectedUser.id);
            if (res.success && res.data) {
                // Transform DB messages to UI format
                const formatted: Message[] = res.data.map((m: any) => ({
                    id: m.id,
                    room: roomId,
                    userId: m.sender_id,
                    userName: m.sender_id === session.user.id ? "Me" : (selectedUser.email?.includes("jeevansaji2107") ? "JEEVAN SAJI" : (selectedUser.name || "User")),
                    content: m.content,
                    timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    created_at: m.created_at
                })).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                setMessages(formatted);
            }
        };
        loadHistory();

    }, [selectedUser, session]);

    // Scroll to bottom
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || !session?.user || !selectedUser) return;

        const roomId = [session.user.id, selectedUser.id].sort().join("_");
        const optimisticMsg: Message = {
            room: roomId,
            userId: session.user.id,
            userName: session.user.name || "Me",
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // 1. Optimistic UI Update
        setMessages(prev => [...prev, optimisticMsg]);
        setInput("");

        // 2. Emit to Socket (Peers see it instantly)
        if (socketRef.current) {
            socketRef.current.emit("send-message", optimisticMsg);
        }

        // 3. Save to Database
        try {
            await sendMessage(optimisticMsg.content, selectedUser.id);
            // Update contact list last message
            setContacts(prev => prev.map(c =>
                c.id === selectedUser.id
                    ? { ...c, lastMsg: optimisticMsg.content, last_msg_time: new Date().toISOString() }
                    : c
            ));
        } catch (error) {
            toast.error("Failed to save message");
        }
    };
    // Filter search results to exclude people already in local contacts
    const globalSearchResults = useMemo(() => {
        return searchResults.filter(sr => !contacts.some(c => c.id === sr.id));
    }, [searchResults, contacts]);

    if (!session) return <div className="p-10 text-center">Please login to chat.</div>;

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-6 h-[calc(100vh-64px)] relative">
            <div className="h-full flex overflow-hidden bg-card/40 backdrop-blur-xl border border-border rounded-3xl shadow-2xl relative z-10">
                {/* Sidebar */}
                <div className="w-80 border-r border-border flex flex-col bg-background/50 relative z-20">
                    <div className="p-6 border-b border-border space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tighter uppercase">
                                NEURAL GRID
                            </h2>
                            <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">{contacts.length} ACTIVE</span>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="text"
                                placeholder="Search conversations or network..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-secondary/50 rounded-xl pl-10 pr-10 py-2 text-sm outline-none border border-border/50 focus:border-primary/50 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* 1. Local Contacts (Filtered) */}
                        {filteredContacts.length > 0 && (
                            <div className="space-y-1 py-4">
                                <div className="px-6 mb-2">
                                    <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.25em]">Direct Channels</span>
                                </div>
                                {filteredContacts.map((contact) => (
                                    <button
                                        key={contact.id}
                                        onClick={() => setSelectedUser(contact)}
                                        className={`w-full flex items-center space-x-3 px-6 py-3 transition-all border-l-2 ${selectedUser?.id === contact.id ? "bg-primary/10 border-primary" : "hover:bg-secondary/30 border-transparent"}`}
                                    >
                                        <div className="relative">
                                            <div className="w-11 h-11 rounded-full overflow-hidden border border-border bg-black">
                                                {contact.image ? (
                                                    <Image src={contact.image} alt="" width={44} height={44} className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-primary font-bold bg-secondary text-sm">
                                                        {contact.name?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            {contact.email === "jeevansaji2107@gmail.com" && (
                                                <div className="absolute -top-0.5 -right-0.5 bg-primary text-white p-0.5 rounded-full border border-background">
                                                    <Check className="w-2.5 h-2.5" strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <p className="text-sm font-bold truncate tracking-tight">{(contact.email?.includes("jeevansaji2107")) ? "JEEVAN SAJI" : contact.name}</p>
                                            <p className="text-[10px] text-muted truncate font-medium">{contact.lastMsg || "Transmission ready"}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* 2. Global Results (if searching) */}
                        {searchQuery.trim().length > 1 && (
                            <div className="space-y-1 pb-4">
                                <div className="px-6 py-2 border-t border-border/10 mt-2">
                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.25em]">Connect Network</span>
                                </div>
                                {isSearching ? (
                                    <div className="px-6 py-4 text-xs text-muted animate-pulse">Scanning frequencies...</div>
                                ) : globalSearchResults.length > 0 ? (
                                    globalSearchResults.map((contact) => (
                                        <button
                                            key={contact.id}
                                            onClick={() => {
                                                setSelectedUser(contact);
                                                setSearchQuery("");
                                            }}
                                            className={`w-full flex items-center space-x-3 px-6 py-3 transition-all border-l-2 ${selectedUser?.id === contact.id ? "bg-primary/10 border-primary" : "hover:bg-secondary/30 border-transparent"}`}
                                        >
                                            <div className="w-9 h-9 rounded-full overflow-hidden border border-border bg-black">
                                                {contact.image ? (
                                                    <Image src={contact.image} alt="" width={36} height={36} className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-primary font-bold bg-secondary text-[10px]">
                                                        {contact.name?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 text-left min-w-0">
                                                <p className="text-xs font-bold truncate">{contact.name}</p>
                                                <p className="text-[9px] text-muted truncate">{contact.email}</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-6 py-4 text-[10px] text-muted uppercase tracking-widest text-center opacity-50">No external nodes found</div>
                                )}
                            </div>
                        )}

                        {/* 3. Empty State */}
                        {filteredContacts.length === 0 && (searchQuery.trim().length <= 1 || (searchResults.length === 0 && !isSearching)) && (
                            <div className="p-10 text-center space-y-4">
                                <div className="flex justify-center"><UserSearch className="w-10 h-10 opacity-10" /></div>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] leading-relaxed">
                                    Node silent.<br />
                                    Sync global network to start transmission.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Chat */}
                <div className="flex-1 flex flex-col bg-background/50 relative overflow-hidden">
                    <PlexusBackground />
                    {selectedUser ? (
                        <>
                            <div className="px-6 py-4 border-b border-border flex items-center justify-between relative z-30 bg-background/50 backdrop-blur-md">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-border shadow-lg">
                                        {selectedUser.image ? (
                                            <Image src={selectedUser.image} alt="" width={40} height={40} className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-secondary flex items-center justify-center font-bold">
                                                {selectedUser.name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm tracking-tight flex items-center gap-2">
                                            {(selectedUser.email?.includes("jeevansaji2107")) ? "JEEVAN SAJI" : selectedUser.name}
                                            {selectedUser.email === "jeevansaji2107@gmail.com" && (
                                                <div className="bg-primary/10 border border-primary/20 rounded-full p-0.5" title="Official Connect Account">
                                                    <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" />
                                            <div className="text-[9px] text-green-500 font-black uppercase tracking-[0.2em]">Synchronized: Online</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2.5 hover:bg-secondary/50 rounded-full transition-all"><Phone className="w-4 h-4 text-muted" /></button>
                                    <button className="p-2.5 hover:bg-secondary/50 rounded-full transition-all"><Video className="w-4 h-4 text-muted" /></button>
                                    <button className="p-2.5 hover:bg-secondary/50 rounded-full transition-all"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                            </div>

                            <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-8 flex flex-col relative z-20 custom-scrollbar">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.userId === session.user.id || msg.userId === "me" ? "justify-end" : "justify-start"} `}>
                                        <div className="max-w-[70%] space-y-1">
                                            <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-lg ${msg.userId === session.user.id || msg.userId === "me"
                                                ? "bg-primary text-white rounded-tr-none shadow-primary/20"
                                                : "bg-secondary/80 backdrop-blur-md rounded-tl-none border border-white/5"
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <p className={`text-[9px] font-bold uppercase tracking-widest text-muted-foreground ${msg.userId === session.user.id || msg.userId === "me" ? "text-right" : "text-left"}`}>
                                                {msg.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-background/50 border-t border-border relative z-10 backdrop-blur-md">
                                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-3 bg-secondary/50 p-2 px-4 rounded-2xl border border-border/50">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-transparent border-none py-2 text-sm outline-none"
                                    />
                                    <button type="submit" disabled={!input.trim()} className="bg-primary p-3 rounded-xl disabled:opacity-50 transition-opacity">
                                        <Send className="w-4 h-4 text-white" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4 relative z-10">
                            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center"><MessageCircle className="w-8 h-8 opacity-20" /></div>
                            <h3 className="font-bold">Chat</h3>
                            <p className="text-xs text-muted">Select a Node to transmit.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
