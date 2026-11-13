import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Testimonials from './pages/Testimonials.jsx';
import Contact from './pages/Contact.jsx';
import Refer from './pages/Refer.jsx';
import ReferConfirmation from './pages/ReferConfirmation.jsx';
import NotFound from './pages/NotFound.jsx';
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));
import useDocumentTitle from './hooks/useDocumentTitle.js';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Behave like a fresh page load on navigation (the original site was multi-page)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// Redirect legacy *.html URLs (old links, bookmarks, Google results) to the new routes
const LEGACY = {
  '/index.html': '/',
  '/about.html': '/about',
  '/services.html': '/services',
  '/testimonials.html': '/testimonials',
  '/contact.html': '/contact',
};

function LegacyRedirect({ to }) {
  const { search } = useLocation();
  useEffect(() => {
    window.location.replace(to + search);
  }, [to, search]);
  return null;
}

export default function App() {
  useDocumentTitle();
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refer" element={<Refer />} />
        <Route path="/refer/confirmation" element={<ReferConfirmation />} />
        <Route path="/r/:code" element={<ReferralRedirect />} />
        {Object.entries(LEGACY).map(([from, to]) => (
          <Route key={from} path={from} element={<LegacyRedirect to={to} />} />
        ))}
        <Route path="/admin/*" element={<Suspense fallback={null}><AdminApp /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// Short link support: /r/ABC123 -> /contact?ref=ABC123
function ReferralRedirect() {
  const { code } = useParams();
  return <Navigate to={`/contact?ref=${encodeURIComponent(code || '')}`} replace />;
}
