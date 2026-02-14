import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        env: {
            hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasAuthSecret: !!process.env.AUTH_SECRET,
            nextAuthUrl: process.env.NEXTAUTH_URL
        }
    });
}
