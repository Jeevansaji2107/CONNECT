import { createClient } from "@supabase/supabase-js"

/**
 * Custom Supabase Adapter for NextAuth v5
 * 
 * This manual implementation avoids strict typing issues and allows
 * direct control over table names and query behavior.
 */
export function CustomSupabaseAdapter(options: { url: string; secret: string }) {
    const supabase = createClient(options.url, options.secret, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })

    return {
        async createUser(user: any) {
            console.log("[CustomAdapter] createUser", user)
            const { data, error } = await supabase
                .from("users")
                .insert({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    email_verified: user.emailVerified ? new Date(user.emailVerified) : null,
                })
                .select()
                .single()

            if (error) {
                console.error("[CustomAdapter] createUser Error", error)
                throw error
            }
            return formatUser(data)
        },

        async getUser(id: string) {
            // console.log("[CustomAdapter] getUser", id)
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", id)
                .single()

            if (error) return null
            return formatUser(data)
        },

        async getUserByEmail(email: string) {
            // console.log("[CustomAdapter] getUserByEmail", email)
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("email", email)
                .single()

            if (error) return null
            return formatUser(data)
        },

        async getUserByAccount({ provider, providerAccountId }: any) {
            // console.log("[CustomAdapter] getUserByAccount", provider, providerAccountId)
            const { data: account, error } = await supabase
                .from("accounts")
                .select("user_id")
                .eq("provider", provider)
                .eq("provider_account_id", providerAccountId)
                .single()

            if (error || !account) return null

            const { data: user, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("id", account.user_id)
                .single()

            if (userError) return null
            return formatUser(user)
        },

        async updateUser(user: any) {
            console.log("[CustomAdapter] updateUser", user)
            const { data, error } = await supabase
                .from("users")
                .update({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    email_verified: user.emailVerified ? new Date(user.emailVerified) : null,
                    updated_at: new Date(),
                })
                .eq("id", user.id)
                .select()
                .single()

            if (error) throw error
            return formatUser(data)
        },

        async deleteUser(userId: string) {
            console.log("[CustomAdapter] deleteUser", userId)
            await supabase.from("users").delete().eq("id", userId)
        },

        async linkAccount(account: any) {
            console.log("[CustomAdapter] linkAccount", account)
            const { error } = await supabase.from("accounts").insert({
                user_id: account.userId,
                type: account.type,
                provider: account.provider,
                provider_account_id: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
            })
            if (error) {
                console.error("[CustomAdapter] linkAccount Error", error)
                throw error
            }
            return account
        },

        async unlinkAccount({ providerAccountId, provider }: any) {
            await supabase
                .from("accounts")
                .delete()
                .eq("provider_account_id", providerAccountId)
                .eq("provider", provider)
        },

        async createSession({ sessionToken, userId, expires }: any) {
            console.log("[CustomAdapter] createSession", userId)
            const { data, error } = await supabase
                .from("sessions")
                .insert({
                    session_token: sessionToken,
                    user_id: userId,
                    expires: new Date(expires),
                })
                .select()
                .single()

            if (error) {
                console.error("[CustomAdapter] createSession Error", error)
                throw error
            }
            return formatSession(data)
        },

        async getSessionAndUser(sessionToken: string) {
            // console.log("[CustomAdapter] getSessionAndUser", sessionToken)
            const { data: session, error } = await supabase
                .from("sessions")
                .select("*")
                .eq("session_token", sessionToken)
                .single()

            if (error || !session) return null

            const { data: user, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("id", session.user_id)
                .single()

            if (userError || !user) return null

            return {
                session: formatSession(session),
                user: formatUser(user),
            }
        },

        async updateSession({ sessionToken }: any) {
            console.log("[CustomAdapter] updateSession", sessionToken)
            // We don't really support updating sessions in this simple adapter 
            // other than maybe expiry, but NextAuth often tries to update it.
            // We'll read it back.
            const { data: session } = await supabase
                .from("sessions")
                .select("*")
                .eq("session_token", sessionToken)
                .single()

            return session ? formatSession(session) : null
        },

        async deleteSession(sessionToken: string) {
            console.log("[CustomAdapter] deleteSession", sessionToken)
            await supabase.from("sessions").delete().eq("session_token", sessionToken)
        },
    }
}

// Helpers to transform data between Postgres snake_case and NextAuth camelCase
function formatUser(user: any) {
    if (!user) return null
    return {
        ...user,
        emailVerified: user.email_verified ? new Date(user.email_verified) : null,
    }
}

function formatSession(session: any) {
    if (!session) return null
    return {
        ...session,
        sessionToken: session.session_token,
        userId: session.user_id,
        expires: new Date(session.expires),
    }
}
