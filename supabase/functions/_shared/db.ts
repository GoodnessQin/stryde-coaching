import { createClient } from 'npm:@supabase/supabase-js@2';

// Server-side admin key (bypasses RLS). Supabase injects these automatically:
//  - new projects:   SUPABASE_SECRET_KEYS = {"default":"sb_secret_..."}
//  - older projects: SUPABASE_SERVICE_ROLE_KEY = "eyJ..."
function adminKey(): string {
  const json = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (json) {
    try {
      const keys = JSON.parse(json);
      if (keys?.default) return keys.default;
    } catch { /* fall through */ }
  }
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (legacy) return legacy;
  throw new Error('No Supabase secret key found in the function environment');
}

// Created on first use (not at startup), so a config problem returns a readable
// error with CORS headers instead of crashing the function before it can respond.
// deno-lint-ignore no-explicit-any
let client: any = null;
// deno-lint-ignore no-explicit-any
export function getDb(): any {
  if (!client) {
    const url = Deno.env.get('SUPABASE_URL');
    if (!url) throw new Error('SUPABASE_URL is not set in the function environment');
    client = createClient(url, adminKey(), { auth: { persistSession: false } });
  }
  return client;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const siteUrl = () =>
  (Deno.env.get('SITE_URL') || 'https://strydecoachings.com').replace(/\/$/, '');

export const normalizeCode = (code: unknown) =>
  String(code ?? '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);

/** Readable reason for logs + the client (no secrets in these messages). */
export const errorDetail = (err: unknown) => {
  if (err && typeof err === 'object') {
    const e = err as { message?: string; code?: string; hint?: string };
    return [e.code, e.message, e.hint].filter(Boolean).join(' | ') || String(err);
  }
  return String(err);
};
