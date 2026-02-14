import { CustomSupabaseAdapter } from "@/lib/custom-supabase-adapter";

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    adapter: CustomSupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    }) as any,
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        Google({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            name: "Demo Account",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "maddy@connect.social" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (credentials?.email === "maddy@connect.social") {
                    // Return a mock user that exists in the DB (or will be linked)
                    // We'll use a fixed ID for the demo user
                    return {
                        id: "00000000-0000-0000-0000-000000000000",
                        name: "Maddy",
                        email: "maddy@connect.social",
                        image: "/avatars/maddy.png",
                    };
                }
                return null;
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (token?.sub && session.user) {
                session.user.id = token.sub;
            }

            if (session.user && process.env.SUPABASE_SERVICE_ROLE_KEY) {
                const signingSecret = process.env.SUPABASE_SERVICE_ROLE_KEY;
                if (signingSecret) {
                    const payload = {
                        aud: "authenticated",
                        exp: Math.floor(new Date(session.expires).getTime() / 1000),
                        sub: session.user.id,
                        email: session.user.email,
                        role: "authenticated",
                    };
                    session.supabaseAccessToken = jwt.sign(payload, signingSecret);
                }
            }
            return session;
        },
    },
});
