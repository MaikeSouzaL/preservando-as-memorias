import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, name, email, is_admin, is_dev_admin, created_at")
    .eq("is_dev_admin", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("ERRO:", error);
    return;
  }
  
  console.log("QTD PERFIS COM is_dev_admin=false:", profiles?.length);
  console.dir(profiles, { depth: null });
}

check();
