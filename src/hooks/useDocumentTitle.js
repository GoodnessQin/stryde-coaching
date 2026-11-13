import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITLES = {
  '/': 'Stryde Coaching',
  '/about': 'About Us - Stryde Coaching',
  '/services': 'Services - Stryde Coaching',
  '/testimonials': 'Testimonials - Stryde Coaching',
  '/contact': 'Contact Us - Stryde Coaching',
  '/refer': 'Refer Someone - Stryde Coaching',
  '/refer/confirmation': "You're In! - Stryde Coaching",
};

export default function useDocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith('/admin')) document.title = 'Admin - Stryde Coaching';
    else document.title = TITLES[pathname] || 'Stryde Coaching';
  }, [pathname]);
}
