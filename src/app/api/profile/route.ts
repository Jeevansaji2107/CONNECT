import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, bio } = await request.json();

        const { data: updatedUser, error } = await supabase
            .from("users")
            .update({
                ...(name !== undefined && { name }),
                ...(bio !== undefined && { bio }),
            })
            .eq("id", session.user.id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/profile");
        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
