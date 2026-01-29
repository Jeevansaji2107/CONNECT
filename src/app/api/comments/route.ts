import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { postId, content } = await request.json();

        if (!content?.trim()) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const { data: comment, error } = await supabase
            .from("comments")
            .insert({
                content,
                post_id: postId,
                author_id: session.user.id,
            })
            .select(`
                *,
                author:users (id, name, image)
            `)
            .single();

        if (error) throw error;

        return NextResponse.json({ comment });
    } catch (error) {
        console.error("Comment creation error:", error);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get("postId");

        if (!postId) {
            return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
        }

        const { data: comments, error } = await supabase
            .from("comments")
            .select(`
                *,
                author:users (id, name, image)
            `)
            .eq("post_id", postId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ comments });
    } catch (error) {
        console.error("Comments fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}
