import { supabase } from '../lib/supabase.js';

export async function fetchReferrers() {
  const { data, error } = await supabase.from('referrers').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, referrer:referrers(id, email, code)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateBooking(id, patch) {
  const { data, error } = await supabase.from('bookings').update(patch).eq('id', id).select('*, referrer:referrers(id, email, code)').single();
  if (error) throw error;
  return data;
}

export async function deleteBooking(id) {
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) throw error;
}

// A referred booking counts as successful once it's scheduled or completed.
export const isSuccessful = (b) => b.status === 'scheduled' || b.status === 'completed';
