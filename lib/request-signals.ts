/**
 * The two signals only the SERVER can read honestly: the caller's IP and their
 * user agent.
 *
 * Meta counts `client_ip_address` and `client_user_agent` as match keys, and
 * they are the two that cost the most when missing: an event without them
 * loses the browser-fingerprint half of the match and the EMQ score drops
 * accordingly. A browser cannot supply its own IP, and a user agent sent up in
 * a JSON body is trivially forgeable, so both come from request headers.
 *
 * WHERE THEY ARE READ IS THE WHOLE TRICK, and this build makes it easy. The
 * India build sends its conversion from a Razorpay webhook, which is a request
 * from Razorpay and not from the buyer: reading these headers there would ship
 * Razorpay's own IP and agent, a confidently wrong value that is worse for
 * matching than shipping nothing, because nothing looks broken. It has to
 * capture them one request earlier and carry them through the order notes.
 *
 * There is no gateway here. /api/register IS the visitor's own browser talking
 * to us, on the same request that sends the Lead, so these are read where they
 * are used and cannot be stale or borrowed. Keep it that way: if a booking
 * webhook is ever added, whatever it reports about IP and agent belongs to the
 * calendar provider, not to the person.
 *
 * Header order matters. `x-forwarded-for` is a comma-separated chain in which
 * the ORIGINAL client is FIRST and every proxy appends itself, so taking the
 * last entry yields the CDN's own address. Vercel's `x-vercel-forwarded-for`
 * and Cloudflare's `cf-connecting-ip` are single-value and already resolved,
 * so they are preferred where present.
 */

const IP_HEADERS = [
  'cf-connecting-ip',
  'x-vercel-forwarded-for',
  'x-real-ip',
] as const;

/** IPv4 dotted quad, or an IPv6 form (possibly with a zone or brackets). */
function looksLikeIp(v: string): boolean {
  if (!v) return false;
  const s = v.replace(/^\[|\]$/g, '');
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(s) || /^[0-9a-f:]+$/i.test(s);
}

export function readClientIp(req: Request): string {
  for (const h of IP_HEADERS) {
    const v = (req.headers.get(h) ?? '').trim();
    if (looksLikeIp(v)) return v;
  }
  /* First entry, not last: the chain reads client, then proxy, then proxy. */
  const first = (req.headers.get('x-forwarded-for') ?? '')
    .split(',')[0]
    ?.trim();
  return looksLikeIp(first ?? '') ? (first as string) : '';
}

export function readClientUserAgent(req: Request): string {
  return (req.headers.get('user-agent') ?? '').trim();
}
 * /api/razorpay/create-order is a SAME-ORIGIN request from the buyer's own
 * browser, so every cookie that browser holds is already sitting on it. Until
 * this was added the route ignored them and trusted whatever the client chose
 * to put in the JSON body instead.
 *
 * That mattered most for Meta's `_fbc`. If the pixel is blocked, or is still
 * loading, or the in-app browser restricted the storage the client reader uses,
 * the body arrives with no fbc and the click id is lost for good, even though
 * the cookie was right there on the request.
 *
 * This is the trick the SDP build used and the reason its data was cleaner:
 * read the cookie from the request, not from the client's report of it.
 *
 * Deliberately tolerant: a `Cookie` header is `a=1; b=2`, values are commonly
 * percent-encoded, and a malformed escape must yield the raw value rather than
 * throw inside a payment route.
 */
export function readRequestCookie(req: Request, name: string): string {
  const header = req.headers.get('cookie') ?? '';
  if (!header) return '';
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() !== name) continue;
    const raw = part.slice(eq + 1).trim();
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return '';
}

