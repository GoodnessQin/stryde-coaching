import { useEffect, useState } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { InjectStyles } from '../components/PageStyles.jsx';
import adminCss from '../styles/admin.css?raw';
import { isSupabaseConfigured, supabase } from '../lib/supabase.js';
import AdminLogin, { SetNewPassword } from './AdminLogin.jsx';
import Overview from './Overview.jsx';
import TestimonialsAdmin from './TestimonialsAdmin.jsx';
import ReferralsAdmin from './ReferralsAdmin.jsx';
import BookingsAdmin from './BookingsAdmin.jsx';

const NAV = [
  { to: '/admin', label: 'Overview', icon: 'fa-solid fa-chart-simple', end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: 'fa-regular fa-calendar-check' },
  { to: '/admin/referrals', label: 'Referrals', icon: 'fa-solid fa-user-group' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: 'fa-regular fa-comment-dots' },
];

export default function AdminApp() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [isAdmin, setIsAdmin] = useState(null);
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.rpc('is_admin').then(({ data }) => setIsAdmin(Boolean(data)));
  }, [session]);

  if (!isSupabaseConfigured) {
    return (
      <>
        <InjectStyles name="admin" css={adminCss} />
        <div className="adm-login">
          <div className="adm-login-card">
            <h1>Admin setup needed</h1>
            <p>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file and rebuild. See README.md.</p>
          </div>
        </div>
      </>
    );
  }

  if (session === undefined || (session && isAdmin === null)) {
    return (<><InjectStyles name="admin" css={adminCss} /><div className="adm-loading">Loading…</div></>);
  }

  if (session && recovery) {
    return (<><InjectStyles name="admin" css={adminCss} /><SetNewPassword onDone={() => setRecovery(false)} /></>);
  }

  if (!session || !isAdmin) {
    return (
      <>
        <InjectStyles name="admin" css={adminCss} />
        <AdminLogin notAdmin={Boolean(session) && !isAdmin} />
      </>
    );
  }

  return (
    <>
      <InjectStyles name="admin" css={adminCss} />
      <div className="adm">
        <aside className="adm-side">
          <div className="adm-brand">
            <img src="/assets/icons/logo.svg" alt="Stryde Coaching" />
            <span>Admin</span>
          </div>
          <nav className="adm-nav">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}>
                <i className={n.icon} aria-hidden="true"></i>{n.label}
              </NavLink>
            ))}
          </nav>
          <div className="adm-side-foot">
            <span>{session.user.email}</span>
            <a href="/" target="_blank" rel="noreferrer">View website ↗</a>
            <a href="#" onClick={(e) => { e.preventDefault(); supabase.auth.signOut(); }}>Sign out</a>
          </div>
        </aside>
        <main className="adm-main">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="bookings" element={<BookingsAdmin />} />
            <Route path="referrals" element={<ReferralsAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
