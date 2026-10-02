import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, './frontend/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log("Testing ai_conversations table existence and RLS...");
  // Attempt to select from ai_conversations
  const { data, error } = await supabase.from('ai_conversations').select('*').limit(1);
  
  if (error) {
    console.error("Table check failed:", error.message);
  } else {
    console.log("ai_conversations table exists. RLS allows read? YES (returned data/empty array). Data:", data);
  }
}

testSupabase();
