import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBookings, fetchReferrers, isSuccessful } from './data.js';
import { Empty, PageHead, StatusBadge, fmtDate } from './shared.jsx';

export default function Overview() {
  const [referrers, setReferrers] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchReferrers(), fetchBookings()])
      .then(([r, b]) => { setReferrers(r); setBookings(b); })
      .catch((e) => setError(e.message));
  }, []);

  const stats = useMemo(() => {
    if (!referrers || !bookings) return null;
    const referred = bookings.filter((b) => b.referrer_id);
    const clicks = referrers.reduce((n, r) => n + (r.clicks || 0), 0);
    const monthAgo = Date.now() - 30 * 864e5;
    return {
      bookings: bookings.length,
      bookings30: bookings.filter((b) => Date.parse(b.created_at) > monthAgo).length,
      newBookings: bookings.filter((b) => b.status === 'new').length,
      referrers: referrers.length,
      clicks,
      referred: referred.length,
      referredOk: referred.filter(isSuccessful).length,
      conversion: clicks ? Math.round((referred.length / clicks) * 100) : 0,
    };
  }, [referrers, bookings]);

  const topReferrers = useMemo(() => {
    if (!referrers || !bookings) return [];
    const counts = {};
    bookings.forEach((b) => { if (b.referrer_id) counts[b.referrer_id] = (counts[b.referrer_id] || 0) + 1; });
    return referrers
      .map((r) => ({ ...r, booked: counts[r.id] || 0 }))
      .filter((r) => r.booked || r.clicks)
      .sort((a, b) => b.booked - a.booked || b.clicks - a.clicks)
      .slice(0, 6);
  }, [referrers, bookings]);

  if (error) return <div className="adm-alert error">{error}</div>;
  if (!stats) return <div className="adm-loading">Loading…</div>;

  return (
    <>
      <PageHead title="Overview" subtitle="Discovery-call bookings and how the referral programme is performing." />

      <div className="adm-stats">
        <Stat label="Bookings" value={stats.bookings} sub={`${stats.bookings30} in the last 30 days`} />
        <Stat label="Awaiting reply" value={stats.newBookings} sub="Status: new" />
        <Stat label="Referrers" value={stats.referrers} sub="People with a referral link" />
        <Stat label="Link visits" value={stats.clicks} sub="Clicks on referral links" />
        <Stat label="Referred bookings" value={stats.referred} sub={`${stats.referredOk} scheduled or completed`} />
        <Stat label="Visit → booking" value={`${stats.conversion}%`} sub="Referral conversion" />
      </div>

      <div className="adm-grid-2">
        <section className="adm-panel">
          <div className="adm-panel-head"><h2>Latest bookings</h2><Link to="/admin/bookings">View all →</Link></div>
          {bookings.length === 0 ? <Empty icon="fa-regular fa-calendar">No bookings yet.</Empty> : (
            <ul className="adm-list">
              {bookings.slice(0, 6).map((b) => (
                <li key={b.id}>
                  <div>
                    {b.full_name}
                    <small>{fmtDate(b.created_at, true)}{b.referrer ? ` · referred by ${b.referrer.email}` : ''}</small>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-panel">
          <div className="adm-panel-head"><h2>Top referrers</h2><Link to="/admin/referrals">View all →</Link></div>
          {topReferrers.length === 0 ? <Empty icon="fa-solid fa-user-group">No referral activity yet.</Empty> : (
            <ul className="adm-list">
              {topReferrers.map((r) => (
                <li key={r.id}>
                  <div>{r.email}<small>Code {r.code} · {r.clicks} visits</small></div>
                  <strong>{r.booked} booked</strong>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat-label">{label}</div>
      <div className="adm-stat-value">{value}</div>
      {sub && <div className="adm-stat-sub">{sub}</div>}
    </div>
  );
}
