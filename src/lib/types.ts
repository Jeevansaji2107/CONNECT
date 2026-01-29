export interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    bio: string | null;
    createdAt: string;
}

export interface Post {
    id: string;
    content: string;
    mediaUrls?: string[] | null;
    authorId: string;
    author: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
    createdAt: string;
    updatedAt: string;
    likes: { user_id: string }[];
    _count: {
        likes: number;
        comments: number;
    };
    isLikedInitial?: boolean;
    isFollowingAuthorInitial?: boolean;
}

export interface Comment {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    author: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
    createdAt: string;
}

import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        supabaseAccessToken?: string;
        user: {
            id: string;
        } & DefaultSession["user"]
    }

    interface User {
        id: string;
    }
}
