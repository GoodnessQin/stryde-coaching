// Referral attribution: a visitor who lands on /contact?ref=CODE is attributed to
// that referrer for 60 days, even if they browse other pages before booking.
const KEY = 'stryde_ref';
const MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000;

export const normalizeCode = (code) => (code || '').toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);

export function saveReferral(code) {
  const c = normalizeCode(code);
  if (!c) return null;
  try { localStorage.setItem(KEY, JSON.stringify({ code: c, ts: Date.now() })); } catch { /* storage unavailable */ }
  return c;
}

export function getReferral() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { code, ts } = JSON.parse(raw);
    if (!code || Date.now() - ts > MAX_AGE_MS) return null;
    return code;
  } catch {
    return null;
  }
}

export function clearReferral() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

export function siteUrl() {
  return (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
}

export const referralLink = (code) => `${siteUrl()}/contact?ref=${encodeURIComponent(code)}`;
