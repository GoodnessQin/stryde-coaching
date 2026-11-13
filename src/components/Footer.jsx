import { Link } from 'react-router-dom';
import { SOCIAL_LINKS, WHATSAPP_URL } from '../data/site.js';

/**
 * Shared footer. The original pages differed slightly:
 *  - testimonials.html put `fade-in` on <footer>, the others on the inner container
 *  - index/about opened social links in a new tab, the others did not
 */
export default function Footer({ fadeOnFooter = false, socialNewTab = false }) {
  const tab = socialNewTab ? { target: '_blank', rel: 'noreferrer' } : {};
  return (
    <footer className={'footer' + (fadeOnFooter ? ' fade-in' : '')}>
      <div className={'container footer-container' + (fadeOnFooter ? '' : ' fade-in')}>
        <div className="footer-column">
          <div className="footer-logo">
            <img src="/assets/icons/logo.svg" alt="Stryde Coaching" />
          </div>

          <h4>Find Us</h4>
          <p>Connect with us across our social handles</p>
          <div className="footer-social">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label} href={s.href} {...tab} aria-label={s.label}><i className={s.icon}></i></a>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/testimonials">Client Reflections</Link></li>
            <li><Link to="/contact">Book a discovery call</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>EXPANDED SUPPORT SERVICES</h4>
          <ul>
            <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Ace my interview</a></li>
            <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Elevate my CV</a></li>
            <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Apply with confidence</a></li>
            <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Enhance my LinkedIn presence</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>
          <ul>
            <li><i className="fas fa-phone"></i> +447879857119</li>
            <li><i className="fas fa-envelope"></i> hello@strydecoachings.com</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>
            <a href="#" onClick={(e) => e.preventDefault()}>PRIVACY POLICY</a> |{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>© STRYDE COACHING</a> | ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}
