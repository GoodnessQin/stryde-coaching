import { useEffect, useRef, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import PageStyles from '../components/PageStyles.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import useScrollAnimations from '../hooks/useScrollAnimations.js';
import { normalizeCode, referralLink } from '../lib/referral.js';

const SHARE_TEXT =
  'I’ve been working with Stryde Coaching and thought you might find it helpful. Book a free 30-minute discovery call here:';

export default function ReferConfirmation() {
  useScrollAnimations();
  const [params] = useSearchParams();
  const code = normalizeCode(params.get('code'));
  const [status, setStatus] = useState('');
  const [showLink, setShowLink] = useState(false);
  const inputRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!code) return <Navigate to="/refer" replace />;
  const link = referralLink(code);

  const flash = (text) => {
    setStatus(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(''), 4000);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      flash('Link copied to your clipboard.');
    } catch {
      inputRef.current?.select();
      flash('Press Ctrl/Cmd + C to copy your link.');
    }
    setShowLink(true);
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Stryde Coaching', text: SHARE_TEXT, url: link });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return; // user closed the share sheet
      }
    }
    copy();
  };

  return (
    <>
      <PageStyles page="refer" />
      <Navbar solid />

      <section className="refer-confirm">
        <div className="refer-hero-content">
          <h1 className="refer-title scale-in">You're In!</h1>
          <p className="refer-subtitle fade-in">
            Your personal referral link is ready. Share it with friends, family, colleagues, and anyone
            who could use a little career direction.
          </p>
          <button type="button" className="refer-btn fade-in" onClick={share}>
            <span>SHARE REFERRAL LINK</span>
            <i className="fa-solid fa-arrow-up-from-bracket" aria-hidden="true"></i>
          </button>

          {showLink && (
            <div className="refer-link-box">
              <input ref={inputRef} readOnly value={link} onFocus={(e) => e.target.select()} aria-label="Your referral link" />
              <button type="button" onClick={copy}>Copy</button>
            </div>
          )}
          <p className="refer-message" role="status">
            {status || 'We’ve also sent your link to your email.'}
          </p>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
