import { supabase } from "@/lib/supabase";

export async function checkDatabase() {
    console.log("--- Supabase Diagnostics ---");
    const tables = ['users', 'posts', 'comments', 'likes', 'follows'];
    const results: Record<string, string> = {};

    for (const table of tables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        results[table] = error ? error.message : `OK (${count} rows)`;
    }

    console.log("Connection Results:", results);
    return results;
}
