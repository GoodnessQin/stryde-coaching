import { useEffect, useRef, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import PageStyles from '../components/PageStyles.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import useScrollAnimations from '../hooks/useScrollAnimations.js';
import { normalizeCode, referralLink } from '../lib/referral.js';

const SHARE_TEXT =
  'I thought you might find Stryde Coaching helpful. Book a free 30-minute discovery call here:';

// Same one-tap share options as the "You're In!" email
function shareLinks(link) {
  const enc = encodeURIComponent;
  return [
    { label: 'WhatsApp', icon: 'fa-brands fa-whatsapp', href: `https://wa.me/?text=${enc(`${SHARE_TEXT} ${link}`)}` },
    { label: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(link)}` },
    { label: 'X / Twitter', icon: 'fa-brands fa-x-twitter', href: `https://twitter.com/intent/tweet?text=${enc(SHARE_TEXT)}&url=${enc(link)}` },
    { label: 'Email', icon: 'fa-regular fa-envelope', href: `mailto:?subject=${enc('A coach I think you should meet')}&body=${enc(`${SHARE_TEXT}\n\n${link}`)}` },
  ];
}

export default function ReferConfirmation() {
  useScrollAnimations();
  const [params] = useSearchParams();
  const code = normalizeCode(params.get('code'));
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!code) return <Navigate to="/refer" replace />;
  const link = referralLink(code);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      inputRef.current?.select();
      document.execCommand?.('copy');
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <PageStyles page="refer" />
      <Navbar solid />

      <section className="refer-confirm">
        <div className="refer-confirm-watermark" aria-hidden="true"></div>

        <div className="refer-hero-content">
          <h1 className="refer-title scale-in">You're In!</h1>
          <p className="refer-subtitle fade-in">
            Your personal referral link is ready. Share it with friends, family, colleagues, and anyone
            who could use a little career direction.
          </p>

          <p className="refer-confirm-label first fade-in">Copy and share your link:</p>
          <div className="refer-link-box fade-in">
            <input
              ref={inputRef}
              readOnly
              value={link}
              onFocus={(e) => e.target.select()}
              aria-label="Your referral link"
            />
            <button type="button" onClick={copy}>
              <i className={copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'} aria-hidden="true"></i>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <p className="refer-confirm-label fade-in">Share it in one tap:</p>
          <div className="refer-share-row fade-in">
            {shareLinks(link).map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="refer-share-btn">
                <i className={s.icon} aria-hidden="true"></i>
                {s.label}
              </a>
            ))}
          </div>

          <p className="refer-confirm-note fade-in">
            When someone books a discovery call through your link, we'll know they came from you.
            Thank you for helping someone find their next stride.
          </p>
          <p className="refer-message" role="status">
            {copied ? 'Link copied to your clipboard.' : 'We’ve also sent your link to your email.'}
          </p>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
