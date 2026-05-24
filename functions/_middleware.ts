/**
 * Cloudflare Pages middleware — injects per-request CSP nonces.
 *
 * Replaces NONCE_PLACEHOLDER in the HTML body and CSP header template
 * with a cryptographically random nonce.  This lets us drop
 * "unsafe-inline" from the Content-Security-Policy entirely.
 */

const NONCE_TOKEN = 'NONCE_PLACEHOLDER';

const CSP_TEMPLATE = [
  "default-src 'self'",
  "script-src 'self' 'nonce-{N}' https://static.cloudflareinsights.com",
  "style-src 'self' 'nonce-{N}'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self' https://api.github.com https://cloudflareinsights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

interface PagesContext {
  request: Request;
  next: () => Promise<Response>;
}

export async function onRequest(ctx: PagesContext): Promise<Response> {
  const resp = await ctx.next();

  const ct = resp.headers.get('content-type') ?? '';
  if (!ct.includes('text/html')) return resp;

  const nonce = crypto.randomUUID();

  let html = await resp.text();
  if (!html.includes(NONCE_TOKEN)) return resp;

  html = html.replaceAll(NONCE_TOKEN, nonce);

  const out = new Response(html, resp);
  out.headers.set('Content-Security-Policy', CSP_TEMPLATE.replaceAll('{N}', nonce));

  return out;
}
