import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { FALLBACK_TESTIMONIALS } from '../data/testimonials.js';

export const splitParagraphs = (text) =>
  (text || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export function mapRow(row) {
  const excerpt = splitParagraphs(row.excerpt);
  return {
    id: row.id,
    name: row.name,
    credentials: row.credentials || '',
    photo: row.photo_url || '/assets/images/stryde-placeholder.svg',
    alt: row.name,
    featured: row.featured,
    paragraphs: splitParagraphs(row.body),
    homeParagraphs: excerpt.length ? excerpt : undefined,
  };
}

let cache = null; // share between Home and Testimonials within a session

/** Published testimonials from Supabase, falling back to the original static content. */
export default function useTestimonials() {
  const [items, setItems] = useState(cache || FALLBACK_TESTIMONIALS);

  useEffect(() => {
    if (!supabase || cache) return undefined;
    let cancelled = false;
    supabase
      .from('testimonials')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled || error || !data || data.length === 0) return;
        cache = data.map(mapRow);
        setItems(cache);
      });
    return () => { cancelled = true; };
  }, []);

  return items;
}

/** Renders "a\nb" as a<br/>b */
export function withBreaks(text) {
  const parts = (text || '').split('\n');
  return parts.flatMap((p, i) => (i === 0 ? [p] : [<br key={i} />, p]));
}
