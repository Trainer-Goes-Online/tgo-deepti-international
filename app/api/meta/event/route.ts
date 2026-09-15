import { NextResponse } from 'next/server';

import { FUNNEL_CONFIG, capiReady, siteUrlReady } from '@/lib/funnel-config';
import {
  sendCapiEvent,
  sha256Hex,
  type Occupation,
  type SendableEvent,
} from '@/lib/meta-capi';

/**
 * One route for the events a BROWSER is allowed to announce: ViewContent and
 * AddToCart, the two funnel steps, plus Schedule, the booking Cal reports back
 * inside its embed.
 *
 * The allow-list below is what keeps a single public route from becoming a
 * hole: only reviewed names are accepted, and LEAD IS EXPLICITLY NOT AMONG
 * THEM. Lead is the conversion this funnel optimises against and it is sent
 * only by /api/register, on the request that also writes the record to
 * Pabbly, so a stranger who finds this endpoint cannot forge one. QualifiedLead
 * is excluded for the same reason: it is a label on that same conversion.
 *
 * Schedule IS accepted here, and that is a stated compromise rather than an
 * oversight. Cal's embed message is the only booking signal this build gets,
 * so the browser is the only available source. It is worth the exposure
 * because the event it could forge is a booking, not the conversion campaigns
 * are bought on.
 *
 * The client IP and user agent are read from THIS request's headers, which is
 * the correct source: this is a fetch from the visitor's own browser.
 */
const ALLOWED: SendableEvent[] = ['ViewContent', 'AddToCart', 'Schedule'];

/* The reserved segment answers, validated against this list rather than passed
   through, so a renamed form option cannot quietly ship a new string to Meta:
   an unrecognised value becomes undefined and the key is simply omitted, which
   is the safe failure. Nothing on this build sends one. */
const OCCUPATIONS: Occupation[] = ['working_professional', 'homemaker'];

export async function POST(req: Request) {
  if (!capiReady()) {
    return NextResponse.json({ ok: false, reason: 'capi-not-configured' });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-json' }, { status: 400 });
  }

  const eventName = String(body.eventName ?? '') as SendableEvent;
  if (!ALLOWED.includes(eventName)) {
    return NextResponse.json(
      { ok: false, reason: 'event-not-allowed' },
      { status: 400 },
    );
  }

  const email = typeof body.email === 'string' ? body.email : '';
  const fbp = typeof body.fbp === 'string' ? body.fbp : undefined;

  const rawOccupation = String(body.occupation ?? '') as Occupation;
  const occupation = OCCUPATIONS.includes(rawOccupation)
    ? rawOccupation
    : undefined;

  const eventSourceUrl =
    (typeof body.eventSourceUrl === 'string' && body.eventSourceUrl) ||
    FUNNEL_CONFIG.fallbackEventSourceUrl;

  /* Loud, not silent. A browser always sends its own href, so this only bites
     when something calls the route without one AND the domain is unset, and an
     empty event_source_url is worthless to Meta while looking like nothing is
     wrong. Law 8: design against the silent no-op. */
  if (!eventSourceUrl) {
    console.error(
      '[meta] no event_source_url: NEXT_PUBLIC_SITE_URL is unset and the caller sent none',
    );
  } else if (!siteUrlReady()) {
    console.warn('[meta] NEXT_PUBLIC_SITE_URL is unset, falling back to the caller url');
  }

  /* Dedup keys, deterministic so Meta's 48h window collapses double-fires:
     by email where we have one, otherwise by the browser's _fbp. */
  const seed = email || fbp || `${Date.now()}_${Math.random()}`;
  const eventId = sha256Hex(`${seed}|${eventName}`);

  const result = await sendCapiEvent({
    pixelId: FUNNEL_CONFIG.meta.pixelId,
    accessToken: FUNNEL_CONFIG.meta.accessToken,
    eventName,
    eventId,
    /* Reduced to the origin inside sendCapiEvent, server-side, because the
       value arriving here is window.location.href with the fbclid on it. */
    eventSourceUrl,
    user: {
      email: email || undefined,
      phone: typeof body.phone === 'string' ? body.phone : undefined,
      firstName: typeof body.firstName === 'string' ? body.firstName : undefined,
      lastName: typeof body.lastName === 'string' ? body.lastName : undefined,
      /* The registration form asks, so nobody is reported as being somewhere
         they are not: a wrong hashed value is worse than a missing one.
         Absent on the landing-page events, which carry no form, and NOT
         defaulted. The India build defaulted to 'in' because that was true of
         almost everyone who saw it; on a funnel pointed at the USA, Canada, the
         UK, Australia and the Middle East, a default is simply a guess, and a
         guessed country hash is a permanently worse match rather than a
         cosmetic one. */
      country:
        typeof body.country === 'string' && body.country.length === 2
          ? body.country.toLowerCase()
          : undefined,
      city: typeof body.city === 'string' ? body.city : undefined,
      externalId:
        typeof body.externalId === 'string' ? body.externalId : undefined,
      fbc: typeof body.fbc === 'string' ? body.fbc : undefined,
      fbp,
      clientIp:
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
      clientUserAgent: req.headers.get('user-agent') ?? undefined,
    },
    /* No value and no currency, on any event this route sends. Nothing is
       charged on this build, and a zero against a currency is not a truer
       answer than an absence: it is a transaction reported where none
       happened. */
    /* Only Schedule carries an id, and it is the opaque registration id. */
    orderId: typeof body.orderId === 'string' ? body.orderId : undefined,
    /* Reserved, and undefined on every event this build sends. */
    occupation,
    /* No content_name, no UTMs, no campaign, no money. custom_data carries an
       opaque id on Schedule and is empty on the rest. See the classification note at
       the top of lib/meta-capi.ts: this is a domain selling against diabetes,
       fatty liver and thyroid, and custom_data is the surface that gets a
       dataset restricted at the root domain. The UTMs the browser still sends
       in this body are deliberately read for nothing here; they reach the
       record through /api/register and Pabbly instead. */
    testEventCode: FUNNEL_CONFIG.meta.testEventCode || undefined,
  });

  return NextResponse.json({ ok: result.ok, eventName, eventId });
}
