import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SOCIAL_LINKS } from '../data/site.js';

const LINKS = [
  { to: '/', label: 'HOME', end: true },
  { to: '/about', label: 'ABOUT US' },
  { to: '/testimonials', label: 'CLIENT REFLECTIONS' },
  { to: '/services', label: 'SERVICES' },
  { to: '/refer', label: 'REFER SOMEONE' },
];

const navClass = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');

function SocialIcons() {
  return SOCIAL_LINKS.map((s) => (
    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
      <i className={s.icon}></i>
    </a>
  ));
}

/**
 * Port of the shared <nav> + "3. MOBILE NAVIGATION" and "4. NAVBAR SCROLL" from js/stryde.js.
 * `solid` keeps the dark background from the start (used on pages without a dark hero).
 */
export default function Navbar({ solid = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const { pathname } = useLocation();

  // Navbar scroll state
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Body scroll lock while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  // Close on navigation
  useEffect(() => setOpen(false), [pathname]);

  // Outside click, Escape, resize
  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (menuRef.current?.contains(e.target) || hamburgerRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth > 768 && setOpen(false);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <nav className={'navbar' + (scrolled || solid ? ' scrolled' : '')} id="navbar">
      <div className="container nav-container">
        <div className="logo">
          <img src="/assets/icons/logo.svg" alt="Stryde Coaching" />
        </div>

        <ul className={'nav-menu' + (open ? ' active' : '')} ref={menuRef}>
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={navClass}>{l.label}</NavLink>
            </li>
          ))}

          {/* Mobile-only: Contact Button */}
          <li className="mobile-only" style={{ marginTop: 30, borderTop: '1px solid rgba(203, 180, 132, 0.2)', paddingTop: 20 }}>
            <NavLink to="/contact" className={({ isActive }) => 'mobile-contact-btn' + (isActive ? ' active' : '')}>CONTACT US</NavLink>
          </li>

          {/* Mobile-only: Social Icons */}
          <li className="mobile-only" style={{ border: 'none' }}>
            <div className="mobile-social-icons"><SocialIcons /></div>
          </li>
        </ul>

        {/* Desktop Only: Social Icons & Contact Button */}
        <div className={'nav-right' + (open ? ' active' : '')}>
          <div className="social-icons"><SocialIcons /></div>
          <Link to="/contact" className="btn-contact">Contact Us</Link>
        </div>

        {/* Hamburger Icon */}
        <div
          className={'hamburger' + (open ? ' active' : '')}
          ref={hamburgerRef}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen((o) => !o);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}
