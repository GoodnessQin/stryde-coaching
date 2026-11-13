// Resend (https://resend.com) via its REST API.
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM = Deno.env.get('RESEND_FROM') || 'Stryde Coaching <hello@strydecoachings.com>';

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      reply_to: opts.replyTo,
    }),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`);
  return res.json();
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

const DARK = '#001a0f';
const GOLD = '#CBB484';

function layout(inner: string, siteUrl: string) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f1ea;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:32px 12px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;">
    <tr><td style="background:${DARK};padding:26px 32px;">
      <a href="${siteUrl}" style="text-decoration:none;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:${GOLD};">Stryde Coaching</a>
    </td></tr>
    ${inner}
    <tr><td style="background:${DARK};padding:22px 32px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#d8d2c2;text-align:center;">
      Stryde Coaching &middot; hello@strydecoachings.com &middot; +447879857119<br>
      <a href="${siteUrl}" style="color:${GOLD};text-decoration:none;">${siteUrl.replace(/^https?:\/\//, '')}</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

export function referralEmail(link: string, siteUrl: string) {
  const shareText = 'I thought you might find Stryde Coaching helpful. Book a free 30-minute discovery call here:';
  const enc = encodeURIComponent;
  const shares = [
    ['WhatsApp', `https://wa.me/?text=${enc(`${shareText} ${link}`)}`],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${enc(link)}`],
    ['X / Twitter', `https://twitter.com/intent/tweet?text=${enc(shareText)}&url=${enc(link)}`],
    ['Email', `mailto:?subject=${enc('A coach I think you should meet')}&body=${enc(`${shareText}\n\n${link}`)}`],
  ];
  const shareCells = shares
    .map(([label, href]) => `<a href="${href}" style="display:inline-block;margin:4px;padding:8px 14px;border:1px solid ${GOLD};color:${DARK};font-family:Arial,sans-serif;font-size:13px;text-decoration:none;">${label}</a>`)
    .join('');

  const html = layout(`
    <tr><td style="padding:48px 40px 20px;text-align:center;">
      <h1 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:44px;color:#000;">You're In!</h1>
      <p style="margin:0 auto 32px;max-width:440px;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#000;">
        Your personal referral link is ready. Share it with friends, family, colleagues, and anyone who could use a little career direction.
      </p>
      <a href="${link}" style="display:inline-block;background:${DARK};color:#f2d58e;padding:18px 40px;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;letter-spacing:.5px;text-decoration:none;">YOUR REFERRAL LINK</a>
      <p style="margin:26px 0 6px;font-family:Arial,sans-serif;font-size:13px;color:#555;">Or copy and share this link:</p>
      <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:14px;word-break:break-all;"><a href="${link}" style="color:${DARK};">${link}</a></p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:13px;color:#555;">Share it in one tap:</p>
      <div>${shareCells}</div>
    </td></tr>
    <tr><td style="padding:12px 40px 40px;text-align:center;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#666;">
      When someone books a discovery call through your link, we'll know they came from you. Thank you for helping someone find their next stride.
    </td></tr>`, siteUrl);

  const text = `You're In!

Your personal referral link is ready. Share it with friends, family, colleagues, and anyone who could use a little career direction.

${link}

Stryde Coaching`;
  return { html, text };
}

export function bookingNotificationEmail(b: {
  fullName: string; email: string; phone: string; message: string;
  referrerEmail?: string | null; referralCode?: string | null;
}, siteUrl: string) {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:8px 0;width:130px;vertical-align:top;font-family:Arial,sans-serif;font-size:13px;color:#777;">${k}</td><td style="padding:8px 0;font-family:Arial,sans-serif;font-size:14px;color:#111;">${v}</td></tr>`;
  const source = b.referrerEmail
    ? `Referral from ${escapeHtml(b.referrerEmail)} (code ${escapeHtml(b.referralCode || '')})`
    : 'Direct (no referral)';
  const html = layout(`
    <tr><td style="padding:36px 40px;">
      <h2 style="margin:0 0 18px;font-family:Georgia,serif;font-weight:normal;font-size:26px;color:#000;">New discovery call request</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${row('Name', escapeHtml(b.fullName))}
        ${row('Email', `<a href="mailto:${escapeHtml(b.email)}">${escapeHtml(b.email)}</a>`)}
        ${row('Phone', escapeHtml(b.phone))}
        ${row('Source', source)}
        ${row('Message', escapeHtml(b.message).replace(/\n/g, '<br>'))}
      </table>
      <p style="margin:28px 0 0;"><a href="${siteUrl}/admin/bookings" style="display:inline-block;background:${DARK};color:${GOLD};padding:12px 24px;font-family:Arial,sans-serif;font-size:13px;text-decoration:none;">Open in admin dashboard</a></p>
    </td></tr>`, siteUrl);
  const text = `New discovery call request\n\nName: ${b.fullName}\nEmail: ${b.email}\nPhone: ${b.phone}\nSource: ${b.referrerEmail ? `Referral from ${b.referrerEmail}` : 'Direct'}\n\n${b.message}`;
  return { html, text };
}
