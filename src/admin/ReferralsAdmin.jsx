import { Fragment, useEffect, useMemo, useState } from 'react';
import { fetchBookings, fetchReferrers, isSuccessful } from './data.js';
import { Empty, PageHead, StatusBadge, downloadCsv, fmtDate, matches, statusLabel, useToast } from './shared.jsx';
import { referralLink } from '../lib/referral.js';

export default function ReferralsAdmin() {
  const [referrers, setReferrers] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [show, setShow] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [toast, showToast] = useToast();

  useEffect(() => {
    Promise.all([fetchReferrers(), fetchBookings()])
      .then(([r, b]) => { setReferrers(r); setBookings(b.filter((x) => x.referrer_id)); })
      .catch((e) => setError(e.message));
  }, []);

  const rows = useMemo(() => {
    if (!referrers) return [];
    const byRef = {};
    bookings.forEach((b) => { (byRef[b.referrer_id] ||= []).push(b); });
    return referrers
      .map((r) => {
        const referred = byRef[r.id] || [];
        return { ...r, referred, successful: referred.filter(isSuccessful).length };
      })
      .filter((r) => (show === 'all' || (show === 'active' ? r.referred.length > 0 : r.referred.length === 0)))
      .filter((r) => matches(q, r.email, r.code, ...r.referred.map((b) => `${b.full_name} ${b.email}`)));
  }, [referrers, bookings, q, show]);

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(referralLink(code));
      showToast('Referral link copied');
    } catch { showToast(referralLink(code)); }
  };

  const exportCsv = () => downloadCsv(`stryde-referrals-${new Date().toISOString().slice(0, 10)}.csv`, [
    ['Referrer email', 'Code', 'Joined', 'Link visits', 'Referred name', 'Referred email', 'Referred phone', 'Booked on', 'Status'],
    ...rows.flatMap((r) => (r.referred.length
      ? r.referred.map((b) => [r.email, r.code, r.created_at, r.clicks, b.full_name, b.email, b.phone, b.created_at, statusLabel(b.status)])
      : [[r.email, r.code, r.created_at, r.clicks, '', '', '', '', '']])),
  ]);

  return (
    <>
      <PageHead title="Referrals" subtitle="Everyone who requested a referral link, and the people who booked through it.">
        <button className="adm-btn" onClick={exportCsv} disabled={!rows.length}><i className="fa-solid fa-download"></i>Export CSV</button>
      </PageHead>

      {error && <div className="adm-alert error">{error}</div>}

      <div className="adm-toolbar">
        <label className="adm-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input placeholder="Search referrer, code, or referred person…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select className="adm-select" value={show} onChange={(e) => setShow(e.target.value)} aria-label="Filter referrers">
          <option value="all">All referrers</option>
          <option value="active">With bookings</option>
          <option value="none">No bookings yet</option>
        </select>
      </div>

      {!referrers ? <div className="adm-loading">Loading…</div> : (
        <div className="adm-table-wrap">
          {rows.length === 0 ? <Empty icon="fa-solid fa-user-group">{referrers.length ? 'No referrers match.' : 'No one has requested a referral link yet.'}</Empty> : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Referrer</th><th>Code</th><th>Joined</th>
                  <th className="num">Link visits</th><th className="num">Booked</th><th className="num">Scheduled / done</th><th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const open = openId === r.id;
                  return (
                    <Fragment key={r.id}>
                      <tr className={'adm-row-click' + (open ? ' adm-row-open' : '')} onClick={() => setOpenId(open ? null : r.id)}>
                        <td><strong>{r.email}</strong></td>
                        <td className="adm-nowrap">
                          <span className="adm-code">{r.code}</span>
                          <button className="adm-icon-btn" title="Copy referral link" onClick={(e) => { e.stopPropagation(); copy(r.code); }}>
                            <i className="fa-regular fa-copy"></i>
                          </button>
                        </td>
                        <td className="adm-nowrap muted">{fmtDate(r.created_at)}</td>
                        <td className="num">{r.clicks}</td>
                        <td className="num"><strong>{r.referred.length}</strong></td>
                        <td className="num">{r.successful}</td>
                        <td className="num"><i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} adm-muted`}></i></td>
                      </tr>
                      {open && (
                        <tr className="adm-sub">
                          <td colSpan={7}>
                            <div className="adm-sub-inner">
                              {r.referred.length === 0 ? (
                                <Empty icon="fa-regular fa-hourglass">
                                  No one has booked through this link yet{r.clicks ? ` (${r.clicks} visit${r.clicks === 1 ? '' : 's'} so far)` : ''}.
                                </Empty>
                              ) : (
                                <table className="adm-table">
                                  <thead><tr><th>Referred person</th><th>Contact</th><th>Booked via contact form</th><th>Status</th></tr></thead>
                                  <tbody>
                                    {r.referred.map((b) => (
                                      <tr key={b.id}>
                                        <td><strong>{b.full_name}</strong></td>
                                        <td>{b.email}<div className="adm-muted" style={{ fontSize: 13 }}>{b.phone}</div></td>
                                        <td><span className="adm-badge yes">Yes</span> <span className="adm-muted" style={{ fontSize: 13 }}>{fmtDate(b.created_at, true)}</span></td>
                                        <td><StatusBadge status={b.status} /></td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
      <p className="adm-muted" style={{ fontSize: 13, marginTop: 14 }}>
        A referral is recorded when someone opens a referral link and then submits the contact form. Update each booking’s status on the Bookings page once the call is scheduled or completed.
      </p>
      {toast}
    </>
  );
}
