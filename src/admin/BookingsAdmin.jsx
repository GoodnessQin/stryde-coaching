import { Fragment, useEffect, useMemo, useState } from 'react';
import { deleteBooking, fetchBookings, updateBooking } from './data.js';
import { Empty, PageHead, STATUSES, downloadCsv, fmtDate, matches, statusLabel, useToast } from './shared.jsx';

export default function BookingsAdmin() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [source, setSource] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [toast, showToast] = useToast();

  useEffect(() => { fetchBookings().then(setRows).catch((e) => setError(e.message)); }, []);

  const filtered = useMemo(() => (rows || []).filter((b) =>
    (status === 'all' || b.status === status) &&
    (source === 'all' || (source === 'referral' ? b.referrer_id : !b.referrer_id)) &&
    matches(q, b.full_name, b.email, b.phone, b.message, b.referrer?.email, b.referral_code)
  ), [rows, q, status, source]);

  const patch = async (id, values, note = 'Saved') => {
    try {
      const updated = await updateBooking(id, values);
      setRows((rs) => rs.map((r) => (r.id === id ? updated : r)));
      showToast(note);
    } catch (e) { setError(e.message); }
  };

  const remove = async (b) => {
    if (!window.confirm(`Delete the booking from ${b.full_name}? This can't be undone.`)) return;
    try {
      await deleteBooking(b.id);
      setRows((rs) => rs.filter((r) => r.id !== b.id));
      showToast('Booking deleted');
    } catch (e) { setError(e.message); }
  };

  const exportCsv = () => downloadCsv(`stryde-bookings-${new Date().toISOString().slice(0, 10)}.csv`, [
    ['Date', 'Name', 'Email', 'Phone', 'Status', 'Referred by', 'Referral code', 'Message', 'Notes'],
    ...filtered.map((b) => [new Date(b.created_at).toISOString(), b.full_name, b.email, b.phone, statusLabel(b.status), b.referrer?.email || '', b.referral_code || '', b.message, b.admin_notes || '']),
  ]);

  return (
    <>
      <PageHead title="Bookings" subtitle="Every discovery-call request sent from the contact form.">
        <button className="adm-btn" onClick={exportCsv} disabled={!filtered.length}><i className="fa-solid fa-download"></i>Export CSV</button>
      </PageHead>

      {error && <div className="adm-alert error">{error}</div>}

      <div className="adm-toolbar">
        <label className="adm-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input placeholder="Search name, email, phone, message…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select className="adm-select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="adm-select" value={source} onChange={(e) => setSource(e.target.value)} aria-label="Filter by source">
          <option value="all">All sources</option>
          <option value="referral">Referrals only</option>
          <option value="direct">Direct only</option>
        </select>
      </div>

      {!rows ? <div className="adm-loading">Loading…</div> : (
        <div className="adm-table-wrap">
          {filtered.length === 0 ? <Empty icon="fa-regular fa-calendar">{rows.length ? 'No bookings match these filters.' : 'No bookings yet. They’ll appear here as soon as someone submits the contact form.'}</Empty> : (
            <table className="adm-table">
              <thead>
                <tr><th>Received</th><th>Name</th><th>Contact</th><th>Source</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const open = openId === b.id;
                  return (
                    <Fragment key={b.id}>
                      <tr className={'adm-row-click' + (open ? ' adm-row-open' : '')} onClick={() => setOpenId(open ? null : b.id)}>
                        <td className="adm-nowrap muted">{fmtDate(b.created_at, true)}</td>
                        <td><strong>{b.full_name}</strong></td>
                        <td>
                          <a href={`mailto:${b.email}`} onClick={(e) => e.stopPropagation()}>{b.email}</a>
                          <div className="adm-muted" style={{ fontSize: 13 }}>{b.phone}</div>
                        </td>
                        <td>
                          {b.referrer
                            ? <>Referral<div className="adm-muted" style={{ fontSize: 13 }}>{b.referrer.email}</div></>
                            : <span className="adm-muted">Direct</span>}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <select
                            className="adm-status-select"
                            value={b.status}
                            onChange={(e) => patch(b.id, { status: e.target.value }, `Marked as ${statusLabel(e.target.value).toLowerCase()}`)}
                            aria-label="Booking status"
                          >
                            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                        </td>
                        <td className="num"><i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} adm-muted`}></i></td>
                      </tr>
                      {open && (
                        <tr className="adm-sub">
                          <td colSpan={6}>
                            <BookingDetail booking={b} onSaveNotes={(notes) => patch(b.id, { admin_notes: notes }, 'Notes saved')} onDelete={() => remove(b)} />
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
      {toast}
    </>
  );
}

function BookingDetail({ booking, onSaveNotes, onDelete }) {
  const [notes, setNotes] = useState(booking.admin_notes || '');
  return (
    <div className="adm-sub-inner" style={{ padding: 18, display: 'grid', gap: 16 }}>
      <div className="adm-field">
        <label>Message</label>
        <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.6 }}>{booking.message}</div>
      </div>
      {booking.referral_code && (
        <div className="adm-muted" style={{ fontSize: 13 }}>
          Booked via referral code <span className="adm-code">{booking.referral_code}</span>
        </div>
      )}
      <div className="adm-field">
        <label htmlFor={`notes-${booking.id}`}>Private notes</label>
        <textarea id={`notes-${booking.id}`} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Call booked for 14 Nov, 10:00" />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={onDelete}><i className="fa-regular fa-trash-can"></i>Delete</button>
        <div style={{ display: 'flex', gap: 10 }}>
          <a className="adm-btn adm-btn-sm" href={`mailto:${booking.email}?subject=${encodeURIComponent('Your Stryde Coaching discovery call')}`}><i className="fa-regular fa-envelope"></i>Email</a>
          <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => onSaveNotes(notes)} disabled={notes === (booking.admin_notes || '')}>Save notes</button>
        </div>
      </div>
    </div>
  );
}
