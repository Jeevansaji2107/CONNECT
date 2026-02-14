const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listTables() {
    const { data, error } = await supabase
        .from('users')
        .select('id')
        .limit(1);

    if (error) {
        console.error('Error connecting to Supabase:', error);
        return;
    }

    console.log('Connection successful.');

    const { data: tables, error: tablesError } = await supabase
        .rpc('get_tables'); // This might not work if RPC isn't defined

    if (tablesError) {
        // Fallback: Check specific tables
        const checkTables = ['posts', 'bookmarks', 'notifications', 'likes', 'comments', 'follows', 'users'];
        for (const table of checkTables) {
            const { error: e } = await supabase.from(table).select('count', { count: 'exact', head: true });
            if (e) {
                console.log(`Table '${table}': MISSING or ERROR (${e.message})`);
            } else {
                console.log(`Table '${table}': EXISTS`);
            }
        }
    } else {
        console.log('Tables:', tables);
    }
}

listTables();
