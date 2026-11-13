import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageStyles from '../components/PageStyles.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import useScrollAnimations from '../hooks/useScrollAnimations.js';
import { createReferral } from '../lib/api.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Refer() {
  useScrollAnimations();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { code } = await createReferral(value);
      navigate(`/refer/confirmation?code=${encodeURIComponent(code)}`, { state: { email: value } });
    } catch (err) {
      console.error(err);
      // Show the underlying reason so setup problems are visible (e.g. "HTTP 401: Invalid JWT")
      setError(err.message?.includes('not configured')
        ? err.message
        : `Something went wrong creating your link. Please try again.${err.reason ? ` (${err.reason})` : ''}`);
      setLoading(false);
    }
  };

  return (
    <>
      <PageStyles page="refer" />
      <Navbar solid />

      <section className="refer-hero">
        <div className="refer-hero-bg"></div>
        <div className="refer-hero-content">
          <h1 className="refer-title scale-in">Your referral can change someone’s career trajectory—and their life</h1>
          <p className="refer-subtitle scale-in">
            One introduction can change a career. Grab your Stryde referral code today and help someone make a move they'll thank you for.
          </p>

          <form className="refer-form fade-in" onSubmit={onSubmit} noValidate>
            <label className="refer-input">
              <i className="fa-regular fa-envelope" aria-hidden="true"></i>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                aria-label="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </label>
            <button type="submit" className="refer-btn" disabled={loading}>
              {loading ? 'GENERATING YOUR LINK...' : 'GET YOUR REFERRAL LINK'}
            </button>
            <p className="refer-message" role="alert">{error}</p>
          </form>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
