const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let key = match[1].trim();
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        env[key] = value;
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("Checking 'groups' table structure...");

    // Try to select columns specifically
    const { error: testError } = await supabase.from('groups').select('cover_image, tags').limit(1);

    if (testError) {
        console.log("Database Test Failed!");
        console.log("Error Code:", testError.code);
        console.log("Error Message:", testError.message);

        if (testError.code === '42703') {
            console.log("\nRESULT: Column 'cover_image' or 'tags' does NOT exist in the live database.");
            console.log("The SQL migration needs to be applied manually in the Supabase SQL Editor.");
        }
    } else {
        console.log("SUCCESS: Columns 'cover_image' and 'tags' exist.");
    }
}

checkSchema();
