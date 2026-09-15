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
