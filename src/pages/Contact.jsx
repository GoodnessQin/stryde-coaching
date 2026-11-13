import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageStyles from '../components/PageStyles.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import ThankYouModal from '../components/ThankYouModal.jsx';
import useScrollAnimations from '../hooks/useScrollAnimations.js';
import { submitContact, trackReferralClick } from '../lib/api.js';
import { saveReferral, getReferral, clearReferral } from '../lib/referral.js';

const EMPTY = { fullName: '', email: '', phone: '', message: '', consent: false };
const CONSENT_HIGHLIGHT = { border: '2px solid #e74c3c', padding: '10px', borderRadius: '5px', backgroundColor: '#ffe6e6' };

export default function Contact() {
  useScrollAnimations();
  const [params] = useSearchParams();
  const [form, setForm] = useState(EMPTY);
  const [message, setMessage] = useState(null); // { text, type }
  const [sending, setSending] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const messageRef = useRef(null);
  const consentRef = useRef(null);
  const timers = useRef([]);

  // Referral link landing: /contact?ref=CODE
  useEffect(() => {
    const ref = params.get('ref');
    if (ref) {
      const code = saveReferral(ref);
      if (code) trackReferralClick(code);
    }
  }, [params]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    requestAnimationFrame(() => messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    timers.current.push(setTimeout(() => setMessage(null), 5000));
  };

  const validate = (data) => {
    if (!data.fullName || !data.email || !data.phone || !data.message) {
      showMessage('Please fill in all fields.', 'error');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showMessage('Please enter a valid email address.', 'error');
      return false;
    }
    if (!/^[\d\s+\-()]+$/.test(data.phone)) {
      showMessage('Please enter a valid phone number.', 'error');
      return false;
    }
    if (!data.consent) {
      consentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setConsentError(true);
      showMessage('⚠️ Please accept the consent checkbox: "Accept the above information will be used to contact you"', 'error');
      timers.current.push(setTimeout(() => setConsentError(false), 3000));
      return false;
    }
    return true;
  };

  const onSend = async (e) => {
    e.preventDefault();
    if (sending) return;
    const data = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
      consent: form.consent,
    };
    if (!validate(data)) return;

    setSending(true);
    try {
      await submitContact({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        ref: getReferral(),
      });
      setForm(EMPTY);
      clearReferral();
      setModalOpen(true);
      document.body.style.overflow = 'hidden';
      trackConversion();
    } catch (err) {
      console.error('❌ Form submission error:', err);
      showMessage(`Something went wrong. Please try again or email us directly at hello@strydecoaching.com${err.reason ? ` (${err.reason})` : ''}`, 'error');
    } finally {
      setSending(false);
    }
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    document.body.style.overflow = 'auto';
  }, []);

  const bind = (name) => ({
    id: name,
    name,
    value: form[name],
    onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
  });

  return (
    <>
      <PageStyles page="contact" />
      <Navbar />

      {/* Contact Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-bg"></div>
        <div className="container">
          <div className="contact-hero-content fade-in">
            <h1>Contact Us.</h1>
            <p className="hero-subtitle">Book A Free Discovery Call</p>
          </div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="contact-cards-section scale-in">
        <div className="container">
          <div className="contact-cards-wrapper">
            <div className="contact-info-card">
              <h2>Sometimes all it takes is 30 focused minutes to gain clarity.</h2>
              <p className="intro-text">This short session helps you:</p>
              <ul className="benefits-list">
                <li>Step out of overwhelm</li>
                <li>Untangle what's really going on</li>
                <li>Get clear on your next move</li>
              </ul>
              <p className="description-text">Whether you're facing a career decision, feeling stuck, or navigating a transition, this is a safe, structured space to pause, reflect, and reset.</p>
              <p className="description-text">In just 30 minutes, you'll leave with perspective, direction, and practical next steps tailored to your situation, not a one-size-fits-all solution.</p>
            </div>

            <div className="contact-form-card">
              <form id="contactForm" className="contact-form" onSubmit={onSend} noValidate>
                <div className="form-group">
                  <input type="text" placeholder="Your full name" required {...bind('fullName')} />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your email address" required {...bind('email')} />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="Phone Number" required {...bind('phone')} />
                </div>
                <div className="form-group">
                  <textarea rows="6" placeholder="Write a note about your request" required {...bind('message')}></textarea>
                </div>

                <div className="form-checkbox" ref={consentRef} style={consentError ? CONSENT_HIGHLIGHT : undefined}>
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    checked={form.consent}
                    onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                  />
                  <label htmlFor="consent">Accept the above information will be used to contact you</label>
                </div>
                <a
                  href="#"
                  id="sendButton"
                  className="btn-submit fade-in"
                  onClick={onSend}
                  style={sending ? { pointerEvents: 'none', opacity: 0.7 } : undefined}
                >
                  {sending ? 'SENDING...' : 'SEND'}
                </a>

                <div
                  id="formMessage"
                  ref={messageRef}
                  className={'form-message' + (message ? ' ' + message.type : '')}
                  style={message ? { display: 'block' } : undefined}
                >
                  {message?.text}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <ThankYouModal open={modalOpen} onClose={closeModal} />

      <Footer />
      <BackToTop />
    </>
  );
}

function trackConversion() {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'conversion', { send_to: 'AW-XXXXXXXXX/XXXXXXXXX', transaction_id: '' });
  }
  if (typeof window.fbq !== 'undefined') window.fbq('track', 'Lead');
}
