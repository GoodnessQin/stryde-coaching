import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { Empty, PageHead, useToast } from './shared.jsx';

const BLANK = { name: '', credentials: '', body: '', excerpt: '', photo_url: '', featured: false, published: true };
const MAX_PHOTO_MB = 5;

async function fetchAll() {
  const { data, error } = await supabase
    .from('testimonials').select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export default function TestimonialsAdmin() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // row or BLANK
  const [toast, showToast] = useToast();

  const load = () => fetchAll().then(setItems).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const featuredCount = (items || []).filter((t) => t.featured && t.published).length;

  const update = async (id, patch, note) => {
    const { error: err } = await supabase.from('testimonials').update(patch).eq('id', id);
    if (err) { setError(err.message); return; }
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    if (note) showToast(note);
  };

  const move = async (index, dir) => {
    const list = [...items];
    const j = index + dir;
    if (j < 0 || j >= list.length) return;
    [list[index], list[j]] = [list[j], list[index]];
    const renumbered = list.map((x, i) => ({ ...x, sort_order: i + 1 }));
    setItems(renumbered);
    const changed = renumbered.filter((x, i) => items.find((o) => o.id === x.id).sort_order !== x.sort_order || i === index || i === j);
    const results = await Promise.all(changed.map((x) => supabase.from('testimonials').update({ sort_order: x.sort_order }).eq('id', x.id)));
    const failed = results.find((r) => r.error);
    if (failed) { setError(failed.error.message); load(); }
  };

  const remove = async (t) => {
    if (!window.confirm(`Delete the testimonial from ${t.name}? This can't be undone.`)) return;
    const { error: err } = await supabase.from('testimonials').delete().eq('id', t.id);
    if (err) { setError(err.message); return; }
    setItems((xs) => xs.filter((x) => x.id !== t.id));
    showToast('Testimonial deleted');
  };

  const onSaved = (row, isNew) => {
    setItems((xs) => (isNew ? [...xs, row] : xs.map((x) => (x.id === row.id ? row : x))));
    setEditing(null);
    showToast(isNew ? 'Testimonial added' : 'Changes saved');
  };

  return (
    <>
      <PageHead title="Testimonials" subtitle="Published testimonials appear on the Client Reflections page. The first 3 marked “Homepage” also show on the home page.">
        <button className="adm-btn adm-btn-primary" onClick={() => setEditing(BLANK)} disabled={!items}>
          <i className="fa-solid fa-plus"></i>Add testimonial
        </button>
      </PageHead>

      {error && <div className="adm-alert error">{error}</div>}
      {items && featuredCount > 3 && (
        <div className="adm-alert info">{featuredCount} testimonials are marked for the homepage; only the first 3 (in this order) are shown.</div>
      )}

      {!items ? <div className="adm-loading">Loading…</div> : items.length === 0 ? (
        <div className="adm-panel"><Empty icon="fa-regular fa-comment-dots">No testimonials yet. Add your first one.</Empty></div>
      ) : (
        <div className="adm-tlist">
          {items.map((t, i) => (
            <div className={'adm-titem' + (t.published ? '' : ' unpublished')} key={t.id}>
              <img src={t.photo_url || '/assets/images/stryde-placeholder.svg'} alt="" />
              <div style={{ minWidth: 0 }}>
                <h3>{t.name}</h3>
                <p>{(t.credentials || '').replace(/\n/g, ' ')}</p>
                <div className="adm-flags">
                  <button className={`adm-badge ${t.published ? 'yes' : 'no'}`} style={{ border: 'none', cursor: 'pointer' }}
                    onClick={() => update(t.id, { published: !t.published }, t.published ? 'Hidden from website' : 'Published')}
                    title="Toggle published">
                    {t.published ? 'Published' : 'Hidden'}
                  </button>
                  <button className={`adm-badge ${t.featured ? 'scheduled' : 'no'}`} style={{ border: 'none', cursor: 'pointer' }}
                    onClick={() => update(t.id, { featured: !t.featured }, t.featured ? 'Removed from homepage' : 'Added to homepage')}
                    title="Toggle homepage">
                    {t.featured ? 'Homepage' : 'Not on homepage'}
                  </button>
                </div>
              </div>
              <div className="adm-titem-actions">
                <button className="adm-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} title="Move up"><i className="fa-solid fa-arrow-up"></i></button>
                <button className="adm-icon-btn" onClick={() => move(i, 1)} disabled={i === items.length - 1} title="Move down"><i className="fa-solid fa-arrow-down"></i></button>
                <button className="adm-btn adm-btn-sm" onClick={() => setEditing(t)}><i className="fa-regular fa-pen-to-square"></i>Edit</button>
                <button className="adm-icon-btn" onClick={() => remove(t)} title="Delete"><i className="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <TestimonialEditor
          initial={editing}
          nextOrder={(items?.reduce((m, x) => Math.max(m, x.sort_order), 0) || 0) + 1}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
      {toast}
    </>
  );
}

function TestimonialEditor({ initial, nextOrder, onClose, onSaved }) {
  const isNew = !initial.id;
  const [form, setForm] = useState({ ...BLANK, ...initial, excerpt: initial.excerpt || '', credentials: initial.credentials || '' });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !busy && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [busy, onClose]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) { setError(`Images must be under ${MAX_PHOTO_MB} MB.`); return; }
    setUploading(true); setError('');
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: err } = await supabase.storage.from('testimonials').upload(path, file, { cacheControl: '31536000', contentType: file.type });
    if (err) { setError(err.message); setUploading(false); return; }
    const { data } = supabase.storage.from('testimonials').getPublicUrl(path);
    setForm((f) => ({ ...f, photo_url: data.publicUrl }));
    setUploading(false);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.body.trim()) { setError('Name and testimonial text are required.'); return; }
    setBusy(true); setError('');
    const payload = {
      name: form.name.trim(),
      credentials: form.credentials.trim() || null,
      body: form.body.trim(),
      excerpt: form.excerpt.trim() || null,
      photo_url: form.photo_url.trim() || null,
      featured: form.featured,
      published: form.published,
      ...(isNew ? { sort_order: nextOrder } : {}),
    };
    const q = isNew
      ? supabase.from('testimonials').insert(payload).select().single()
      : supabase.from('testimonials').update(payload).eq('id', initial.id).select().single();
    const { data, error: err } = await q;
    setBusy(false);
    if (err) setError(err.message);
    else onSaved(data, isNew);
  };

  return (
    <div className="adm-modal" onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <form className="adm-modal-card" onSubmit={save}>
        <div className="adm-modal-head">
          <h2>{isNew ? 'Add testimonial' : 'Edit testimonial'}</h2>
          <button type="button" className="adm-icon-btn" onClick={onClose} aria-label="Close"><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="adm-modal-body">
          {error && <div className="adm-alert error">{error}</div>}

          <div className="adm-field">
            <label>Photo</label>
            <div className="adm-photo">
              <img src={form.photo_url || '/assets/images/stryde-placeholder.svg'} alt="" />
              <div className="adm-photo-actions">
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
                <button type="button" className="adm-btn adm-btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  <i className="fa-solid fa-upload"></i>{uploading ? 'Uploading…' : form.photo_url ? 'Replace photo' : 'Upload photo'}
                </button>
                {form.photo_url && (
                  <button type="button" className="adm-link-btn" style={{ alignSelf: 'flex-start' }} onClick={() => setForm((f) => ({ ...f, photo_url: '' }))}>Remove photo</button>
                )}
                <span className="hint" style={{ fontSize: 12, color: 'var(--adm-muted)' }}>Portrait photos work best. JPG/PNG/WebP, max {MAX_PHOTO_MB} MB.</span>
              </div>
            </div>
          </div>

          <div className="adm-row">
            <div className="adm-field">
              <label htmlFor="t-name">Name *</label>
              <input id="t-name" type="text" value={form.name} onChange={set('name')} required />
            </div>
            <div className="adm-field">
              <label htmlFor="t-cred">Title / credentials <span className="hint">(new line = line break)</span></label>
              <textarea id="t-cred" rows={2} value={form.credentials} onChange={set('credentials')} placeholder="e.g. Lecturer in Law, Birmingham City University" />
            </div>
          </div>

          <div className="adm-field">
            <label htmlFor="t-body">Testimonial *  <span className="hint">Leave a blank line between paragraphs.</span></label>
            <textarea id="t-body" rows={9} value={form.body} onChange={set('body')} required />
          </div>

          <div className="adm-field">
            <label htmlFor="t-excerpt">Homepage text <span className="hint">(optional — a shorter version for the homepage card; otherwise the first 2 paragraphs are used)</span></label>
            <textarea id="t-excerpt" rows={4} value={form.excerpt} onChange={set('excerpt')} />
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <label className="adm-check"><input type="checkbox" checked={form.published} onChange={set('published')} />Published on website</label>
            <label className="adm-check"><input type="checkbox" checked={form.featured} onChange={set('featured')} />Show on homepage</label>
          </div>
        </div>
        <div className="adm-modal-foot">
          <button type="button" className="adm-btn" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="adm-btn adm-btn-primary" disabled={busy || uploading}>{busy ? 'Saving…' : isNew ? 'Add testimonial' : 'Save changes'}</button>
        </div>
      </form>
    </div>
  );
}
