import { Client } from 'pg';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Parse URL to connect via postgres:
// e.g. https://xpgxfcsjkubkhmvkvzcu.supabase.co
// to: postgres://postgres:[YOUR-PASSWORD]@db.xpgxfcsjkubkhmvkvzcu.supabase.co:5432/postgres
const projectId = SUPABASE_URL.replace('https://', '').split('.')[0];
const connectionString = process.env.DATABASE_URL || `postgres://postgres:${SUPABASE_KEY}@db.${projectId}.supabase.co:5432/postgres`;

async function addColumn() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to DB');
    
    await client.query('ALTER TABLE memorials ADD COLUMN IF NOT EXISTS delivery_address JSONB;');
    console.log('Added delivery_address to memorials');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

addColumn();
