import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLORS = ['#CBB484', '#1B201C', '#FFF4DC', '#10b981', '#f59e0b'];

/** Thank-you modal + confetti, ported from contact.html / js/form.js */
export default function ThankYouModal({ open, onClose }) {
  const [pieces, setPieces] = useState([]);

  // Confetti: 50 pieces added 100ms apart, each removed after 5s
  useEffect(() => {
    if (!open) { setPieces([]); return undefined; }
    const timers = [];
    for (let i = 0; i < 50; i++) {
      timers.push(setTimeout(() => {
        const p = {
          id: `${Date.now()}-${i}`,
          left: Math.random() * 100 + '%',
          background: COLORS[Math.floor(Math.random() * COLORS.length)],
          animationDelay: Math.random() * 3 + 's',
          animationDuration: Math.random() * 2 + 2 + 's',
          borderRadius: Math.random() > 0.5 ? '50%' : undefined,
        };
        setPieces((ps) => [...ps, p]);
        timers.push(setTimeout(() => setPieces((ps) => ps.filter((x) => x.id !== p.id)), 5000));
      }, i * 100));
    }
    return () => timers.forEach(clearTimeout);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div id="thankYouModal" className={'thank-you-modal' + (open ? ' show' : '')}>
      <div className="modal-overlay" onClick={onClose}></div>

      <div className="confetti-container" id="confetti">
        {pieces.map(({ id, ...style }) => (
          <div key={id} className="confetti-piece" style={style}></div>
        ))}
      </div>

      <div className="thank-you-container modal-content">
        <button className="modal-close" id="closeModal" onClick={onClose}>&times;</button>

        <div className="success-icon">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>

        <div className="celebration-icons">
          {['🎉', '⭐', '🎊', '✨', '🎉', '⭐'].map((ic, i) => (
            <span key={i} className="icon" style={{ '--delay': `${i * 0.2}s` }}>{ic}</span>
          ))}
        </div>

        <h1 className="thank-you-title">
          Thank You for Booking<br />
          Your 30-Minute Discovery Call!
        </h1>

        <p className="thank-you-subtitle">
          Check your email within 24 hours for your personalized session link, and get
          ready to step out of overwhelm and move forward with confidence.
        </p>

        <div className="next-steps">
          <div className="step"><div className="step-number">1</div><p>Check your email inbox</p></div>
          <div className="step"><div className="step-number">2</div><p>Add the call to your calendar</p></div>
          <div className="step"><div className="step-number">3</div><p>Prepare your questions</p></div>
        </div>

        <Link to="/" className="btn-home" onClick={onClose}>Go Back Home</Link>

        <div className="social-share">
          <p>Share your excitement:</p>
          <div className="share-buttons">
            <a href="https://twitter.com/intent/tweet?text=Just%20booked%20a%20discovery%20call%20with%20@StrydeCoaching!" target="_blank" rel="noreferrer" aria-label="Share on Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://strydecoaching.com" target="_blank" rel="noreferrer" aria-label="Share on LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
