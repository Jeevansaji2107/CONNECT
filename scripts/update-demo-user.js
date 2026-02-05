
const { createClient } = require('@supabase/supabase-js');

// Env vars are loaded via node --env-file=.env

async function updateDemoUser() {
    console.log('Updating Demo User...');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('Missing Supabase URL or Key');
        return;
    }

    const supabase = createClient(url, key);
    const demoId = "00000000-0000-0000-0000-000000000000";

    try {
        const { data, error } = await supabase
            .from('users')
            .update({
                name: "Maddy",
                email: "maddy@connect.social",
                image: "/avatars/maddy.png",
                email_verified: new Date().toISOString()
            })
            .eq('id', demoId)
            .select()
            .single();

        if (error) {
            console.error('Error updating demo user:', error);
        } else {
            console.log('Success! Updated user:', data);
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

updateDemoUser();
