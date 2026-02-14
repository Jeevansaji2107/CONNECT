import { create } from 'zustand';

interface ChatState {
    unreadCount: number;
    incrementUnread: () => void;
    resetUnread: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    unreadCount: 0,
    incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
    resetUnread: () => set({ unreadCount: 0 }),
}));

interface UIState {
    expandedPostId: string | null;
    setExpandedPostId: (id: string | null) => void;
    onlineUsers: string[];
    setOnlineUsers: (users: string[]) => void;
    activityLog: any[];
    addActivity: (activity: any) => void;
}

export const useUIStore = create<UIState>((set) => ({
    expandedPostId: null,
    setExpandedPostId: (id) => set({ expandedPostId: id }),
    onlineUsers: [],
    setOnlineUsers: (users) => set({ onlineUsers: users }),
    activityLog: [],
    addActivity: (activity) => set((state) => ({
        activityLog: [activity, ...state.activityLog].slice(0, 10)
    })),
}));
