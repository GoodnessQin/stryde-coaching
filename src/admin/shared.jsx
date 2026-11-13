import { useEffect, useState } from 'react';

export const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'scheduled', label: 'Call scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];
export const statusLabel = (s) => STATUSES.find((x) => x.value === s)?.label || s;

export function StatusBadge({ status }) {
  return <span className={`adm-badge ${status}`}>{statusLabel(status)}</span>;
}

export const fmtDate = (iso, withTime = false) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
};

export function PageHead({ title, subtitle, children }) {
  return (
    <div className="adm-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="adm-actions">{children}</div>}
    </div>
  );
}

export function Empty({ icon = 'fa-regular fa-folder-open', children }) {
  return <div className="adm-empty"><i className={icon}></i>{children}</div>;
}

export function useToast() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    if (!msg) return undefined;
    const t = setTimeout(() => setMsg(''), 2600);
    return () => clearTimeout(t);
  }, [msg]);
  const node = msg ? <div className="adm-toast" role="status">{msg}</div> : null;
  return [node, setMsg];
}

export function downloadCsv(filename, rows) {
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = rows.map((r) => r.map(esc).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export const matches = (q, ...fields) => {
  if (!q) return true;
  const needle = q.toLowerCase();
  return fields.some((f) => (f || '').toLowerCase().includes(needle));
};
