import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const { data: profileData } = await supabase.from('profiles').select('id').limit(1).single();
  const userId = profileData?.id;

  if (!userId) {
    console.log('No profiles found');
    process.exit(1);
  }

  // Instead of SQL, we can't alter column using JS client unless via RPC.
  // Wait, I can just use fetch to the REST API with a raw query? No.
  // We can just install postgres locally.
  console.log('Use postgres driver');
}

test();
