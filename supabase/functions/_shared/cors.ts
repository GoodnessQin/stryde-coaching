const BASE = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};
const DEFAULT_HEADERS = 'authorization, x-client-info, apikey, content-type, x-region';

// Echo back whatever headers the browser asks to send, so a new supabase-js
// header can never break the CORS preflight.
export function corsFor(req?: Request) {
  const requested = req?.headers.get('access-control-request-headers');
  return { ...BASE, 'Access-Control-Allow-Headers': requested || DEFAULT_HEADERS };
}

export const corsHeaders = corsFor();

export function json(body: unknown, status = 200, req?: Request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsFor(req), 'Content-Type': 'application/json' },
  });
}
