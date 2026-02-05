
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Env vars are loaded via node --env-file=.env

async function testConnection() {
    console.log('Testing Supabase Connection...');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('Missing Supabase URL or Key in process.env');
        return;
    }

    const supabase = createClient(url, key);

    try {
        // Check for demo user by email
        console.log("Checking for 'maddy@connect.social'...");
        const { data: usersByEmail, error: emailError } = await supabase
            .from('users')
            .select('*')
            .eq('email', 'maddy@connect.social');

        if (emailError) {
            console.error('Error fetching by email:', emailError);
        } else {
            console.log(`Found ${usersByEmail.length} users with this email.`);
            usersByEmail.forEach(u => console.log(` - ID: ${u.id}, Name: ${u.name}`));
        }

        // Check for demo user by ID
        const demoId = "00000000-0000-0000-0000-000000000000";
        console.log(`Checking for ID '${demoId}'...`);
        const { data: usersById, error: idError } = await supabase
            .from('users')
            .select('*')
            .eq('id', demoId);

        if (idError) {
            console.error('Error fetching by ID:', idError);
        } else {
            console.log(`Found ${usersById.length} users with this ID.`);
            usersById.forEach(u => console.log(` - Email: ${u.email}, Name: ${u.name}`));
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
