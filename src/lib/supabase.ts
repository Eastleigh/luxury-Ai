import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!_supabase) {
    try {
      _supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    } catch {
      return null;
    }
  }
  return _supabase;
}

let _defaultSupabase: SupabaseClient | null = null;
try {
  _defaultSupabase = supabaseUrl && supabaseAnonKey
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : null;
} catch {
  _defaultSupabase = null;
}
export const supabase = _defaultSupabase;
