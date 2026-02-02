const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env
try {
    const envConfig = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            let value = valueParts.join('=').trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            process.env[key.trim()] = value;
        }
    });
} catch (e) {
    console.error("Could not read .env file", e);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Connection to:', url);
console.log('Using Key (approx):', key ? key.substring(0, 10) + '...' : 'MISSING');

if (!url || !key) {
    console.error('ERROR: Missing Credentials');
    process.exit(1);
}

const supabase = createClient(url, key, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function test() {
    try {
        console.log('Attempting to select from users table...');
        const { data, error } = await supabase.from('users').select('*').limit(1);

        if (error) {
            console.error('SUPABASE QUERY ERROR:', error);
        } else {
            console.log('SUCCESS! Users found:', data.length);

            // Check for messages table existence and structure
            console.log('Checking messages table...');
            const { data: messages, error: msgError } = await supabase
                .from('messages')
                .select('*')
                .limit(1);

            if (msgError) {
                console.error('MESSAGES TABLE ERROR:', msgError.message);
                // If error implies "relation does not exist", we need to create it.
            } else {
                console.log('Messages table accessible. Count:', messages.length);
            }

            const targetEmail = 'jeevansaji2107@gmail.com';
            console.log(`Searching for ${targetEmail}...`);

            const { data: targetUser, error: searchError } = await supabase
                .from('users')
                .select('*')
                .eq('email', targetEmail)
                .single();

            if (searchError) {
                console.log(`User ${targetEmail} NOT FOUND (or error):`, searchError.message);
            } else {
                console.log('FOUND OFFICIAL USER:', targetUser);
            }

            // Check accounts for the first user to see linking
            if (data.length > 0) {
                const userId = data[0].id; // Likely the user we just logged in as
                console.log(`Checking accounts for User ID: ${userId} (${data[0].email})`);

                const { data: accounts, error: accountError } = await supabase
                    .from('accounts')
                    .select('provider, provider_account_id')
                    .eq('user_id', userId);

                if (accountError) {
                    console.error('Error fetching accounts:', accountError);
                } else {
                    console.log('Linked Accounts found:', accounts);
                }
            }
        }
    } catch (err) {
        console.error('UNEXPECTED ERROR:', err);
    }
}

test();
