// POST { email } -> { code, link, emailSent }
// Creates (or reuses) a referral code for the email and emails the link via Resend.
import { corsFor, json as baseJson } from '../_shared/cors.ts';
import { getDb, EMAIL_RE, errorDetail, siteUrl } from '../_shared/db.ts';
import { referralEmail, sendEmail } from '../_shared/email.ts';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
const makeCode = (len = 6) => {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
};

const RESEND_COOLDOWN_MS = 60_000;

Deno.serve(async (req) => {
  const json = (body: unknown, status = 200) => baseJson(body, status, req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsFor(req) });
  if (req.method === 'GET') return json({ ok: true, function: 'create-referral', message: 'Function is deployed. Use POST.' });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const db = getDb();
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? '').trim().toLowerCase();
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return json({ error: 'Please enter a valid email address.' }, 400);
    }

    // Reuse an existing referrer for this email
    let { data: referrer, error } = await db
      .from('referrers').select('*').eq('email', email).maybeSingle();
    if (error) throw error;

    if (!referrer) {
      for (let attempt = 0; attempt < 6 && !referrer; attempt++) {
        const { data, error: insErr } = await db
          .from('referrers').insert({ email, code: makeCode() }).select().single();
        if (!insErr) { referrer = data; break; }
        if (insErr.code !== '23505') throw insErr; // not a unique violation
        // Email inserted concurrently? Pick it up; otherwise retry with a new code.
        const { data: again } = await db.from('referrers').select('*').eq('email', email).maybeSingle();
        if (again) referrer = again;
      }
      if (!referrer) throw new Error('Could not allocate a referral code');
    }

    const link = `${siteUrl()}/contact?ref=${referrer.code}`;

    let emailSent = false;
    const last = referrer.last_email_sent_at ? Date.parse(referrer.last_email_sent_at) : 0;
    if (Date.now() - last > RESEND_COOLDOWN_MS) {
      try {
        const { html, text } = referralEmail(link, siteUrl());
        await sendEmail({ to: email, subject: "You're In! Your Stryde Coaching referral link", html, text });
        emailSent = true;
        await db.from('referrers').update({ last_email_sent_at: new Date().toISOString() }).eq('id', referrer.id);
      } catch (mailErr) {
        console.error('Referral email failed:', mailErr);
      }
    }

    return json({ code: referrer.code, link, emailSent });
  } catch (err) {
    const detail = errorDetail(err);
    console.error('Function failed:', detail);
    return json({ error: 'Something went wrong. Please try again.', detail }, 500);
  }
});
