import { requireSupabase, supabase } from './supabase.js';

async function invoke(name, body) {
  const client = requireSupabase();
  const { data, error } = await client.functions.invoke(name, { body });
  if (error) {
    // Build a readable reason: HTTP status + the function's own message/detail
    const res = error.context;
    let reason = error.message;
    let userMessage = null;
    try {
      const body = await res?.clone?.().json?.();
      if (body?.error) userMessage = body.error;
      reason = [res?.status && `HTTP ${res.status}`, body?.detail || body?.message || body?.error || body?.msg]
        .filter(Boolean).join(': ') || reason;
    } catch {
      if (res?.status) reason = `HTTP ${res.status}`;
    }
    if (error.name === 'FunctionsFetchError') {
      reason = `Could not reach the "${name}" function (not deployed, wrong VITE_SUPABASE_URL, or blocked by CORS)`;
    }
    console.error(`[${name}]`, reason, error);
    const err = new Error(userMessage || reason);
    err.reason = reason;
    err.status = res?.status;
    throw err;
  }
  if (data?.error) throw new Error(data.error);
  return data;
}

/** Register a referrer; emails them their link. Returns { code, link } */
export const createReferral = (email) => invoke('create-referral', { email });

/** Contact / discovery-call form. Returns { ok: true } */
export const submitContact = (payload) => invoke('submit-contact', payload);

/** Count a visit from a referral link (fire-and-forget). */
export async function trackReferralClick(code) {
  if (!supabase || !code) return;
  const k = `stryde_ref_click_${code}`;
  try {
    if (sessionStorage.getItem(k)) return;
    sessionStorage.setItem(k, '1');
  } catch { /* ignore */ }
  await supabase.rpc('track_referral_click', { p_code: code }).then(() => {}, () => {});
}

/** Look up the code for an email-confirmation page refresh. */
export async function referralExists(code) {
  if (!supabase || !code) return false;
  const { data } = await supabase.rpc('referral_code_exists', { p_code: code });
  return Boolean(data);
}
