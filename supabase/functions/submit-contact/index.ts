// POST { fullName, email, phone, message, ref? } -> { ok: true }
// Stores the discovery-call request, attributes it to a referrer, notifies the admin.
import { corsFor, json as baseJson } from '../_shared/cors.ts';
import { getDb, EMAIL_RE, errorDetail, normalizeCode, siteUrl } from '../_shared/db.ts';
import { bookingNotificationEmail, sendEmail } from '../_shared/email.ts';

const clip = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

Deno.serve(async (req) => {
  const json = (body: unknown, status = 200) => baseJson(body, status, req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsFor(req) });
  if (req.method === 'GET') return json({ ok: true, function: 'submit-contact', message: 'Function is deployed. Use POST.' });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const db = getDb();
    const body = await req.json().catch(() => ({}));
    const fullName = clip(body.fullName, 200);
    const email = clip(body.email, 254).toLowerCase();
    const phone = clip(body.phone, 40);
    const message = clip(body.message, 5000);
    const code = normalizeCode(body.ref);

    if (!fullName || !email || !phone || !message) return json({ error: 'Please fill in all fields.' }, 400);
    if (!EMAIL_RE.test(email)) return json({ error: 'Please enter a valid email address.' }, 400);
    if (!/^[\d\s+\-()]+$/.test(phone)) return json({ error: 'Please enter a valid phone number.' }, 400);

    let referrer: { id: string; email: string; code: string } | null = null;
    if (code) {
      const { data } = await db.from('referrers').select('id,email,code').eq('code', code).maybeSingle();
      // People can't refer themselves
      if (data && data.email !== email) referrer = data;
    }

    const { error } = await db.from('bookings').insert({
      full_name: fullName,
      email,
      phone,
      message,
      referrer_id: referrer?.id ?? null,
      referral_code: referrer ? referrer.code : null,
    });
    if (error) throw error;

    const adminTo = (Deno.env.get('ADMIN_NOTIFY_EMAIL') || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (adminTo.length) {
      try {
        const { html, text } = bookingNotificationEmail(
          { fullName, email, phone, message, referrerEmail: referrer?.email, referralCode: referrer?.code },
          siteUrl(),
        );
        await sendEmail({
          to: adminTo,
          subject: `New discovery call request: ${fullName}${referrer ? ' (referral)' : ''}`,
          html,
          text,
          replyTo: email,
        });
      } catch (mailErr) {
        console.error('Admin notification failed:', mailErr);
      }
    }

    return json({ ok: true });
  } catch (err) {
    const detail = errorDetail(err);
    console.error('Function failed:', detail);
    return json({ error: 'Something went wrong. Please try again.', detail }, 500);
  }
});
