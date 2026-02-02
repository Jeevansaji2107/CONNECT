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
