import { useState } from 'react';
import { supabase } from '../lib/supabase.js';

export default function AdminLogin({ notAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const signIn = async (e) => {
    e.preventDefault();
    setBusy(true); setError(''); setInfo('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (err) setError(err.message === 'Invalid login credentials' ? 'Incorrect email or password.' : err.message);
    setBusy(false);
  };

  const reset = async () => {
    if (!email.trim()) { setError('Enter your email first, then click "Forgot password".'); return; }
    setBusy(true); setError('');
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin`,
    });
    setBusy(false);
    if (err) setError(err.message);
    else setInfo('Check your inbox for a password reset link.');
  };

  if (notAdmin) {
    return (
      <div className="adm-login">
        <div className="adm-login-card">
          <img src="/assets/icons/logo.svg" alt="Stryde Coaching" />
          <h1>No admin access</h1>
          <p>This account is signed in but isn’t an admin. Ask the site owner to add you to the <code>admins</code> table.</p>
          <button className="adm-btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={signIn}>
        <img src="/assets/icons/logo.svg" alt="Stryde Coaching" />
        <div>
          <h1>Admin sign in</h1>
          <p>Manage testimonials, referrals and bookings.</p>
        </div>
        {error && <div className="adm-alert error">{error}</div>}
        {info && <div className="adm-alert info">{info}</div>}
        <div className="adm-field">
          <label htmlFor="adm-email">Email</label>
          <input id="adm-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="adm-field">
          <label htmlFor="adm-pass">Password</label>
          <input id="adm-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="adm-btn adm-btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <button type="button" className="adm-link-btn" onClick={reset} disabled={busy}>Forgot password?</button>
      </form>
    </div>
  );
}

export function SetNewPassword({ onDone }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async (e) => {
    e.preventDefault();
    if (password.length < 8) { setError('Use at least 8 characters.'); return; }
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) setError(err.message); else onDone();
  };
  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={save}>
        <img src="/assets/icons/logo.svg" alt="Stryde Coaching" />
        <h1>Set a new password</h1>
        {error && <div className="adm-alert error">{error}</div>}
        <div className="adm-field">
          <label htmlFor="adm-newpass">New password</label>
          <input id="adm-newpass" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="adm-btn adm-btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save password'}</button>
      </form>
    </div>
  );
}
