import crypto from 'crypto';

import { NextResponse } from 'next/server';

import { FUNNEL_CONFIG, capiReady, isTestMode, siteUrlReady } from '@/lib/funnel-config';
import { ga4ServerReady, sendGa4Lead } from '@/lib/ga4-server';
import { sendCapiEvent, type Occupation } from '@/lib/meta-capi';
import { pabblyReady, sendPabblyLead } from '@/lib/pabbly';
import { readClientIp, readClientUserAgent } from '@/lib/request-signals';

/**
 * THE REGISTRATION. This route is what the India build's Razorpay order,
 * webhook and Purchase event collapse into once the assessment is free.
 *
 * It is the funnel's only conversion point, and it does four things in a fixed
 * order:
 *   1. validates the submission
 *   2. hands the record to Pabbly, so the person is actually fulfilled
 *   3. sends Meta's `Lead`
 *   4. sends GA4's `generate_lead`
 *
 * ── WHY PABBLY GOES FIRST ─────────────────────────────────────────────
 * Fulfilment must never depend on analytics being switched on. The same
 * ordering exists on the India build's webhook and for the same reason, but it
 * matters more here: no payment gateway holds a second copy of who registered,
 * so Pabbly is the ONLY record that this person exists. See lib/pabbly.ts.
 *
 * ── WHY THE CONVERSION IS SENT FROM A SERVER ROUTE ────────────────────
 * Because this is the one place the submission is proven, because it is the
 * only place the visitor's own IP and user agent can be read honestly (this is
 * a fetch from their browser, unlike a gateway's webhook), and because a public
 * browser endpoint that accepts a conversion by name is an endpoint anyone can
 * post a fake conversion to. /api/meta/event refuses `Lead` for that reason.
 *
 * ── WHAT IT RETURNS ───────────────────────────────────────────────────
 * `{ ok, leadId }`. The browser carries that id to /book-a-call and on to
 * /thank-you, exactly as the payment id used to be carried, so the booking can
 * be keyed against the registration.
 *
 * A failure to reach Meta or GA4 does NOT fail the request. The person filled
 * in a form; refusing them the next page because a third party was unreachable
 * would cost a real registration to protect a number.
 */

const truncate = (v: unknown, max = 256) => {
  const s = v == null ? '' : String(v);
  return s.length > max ? s.slice(0, max) : s;
};

/* The reserved segment answers, validated against this list rather than passed
   through, so a renamed form option cannot quietly ship a new string to Meta.
   Nothing on this build sends one: see lib/meta-capi.ts. */
const OCCUPATIONS: Occupation[] = ['working_professional', 'homemaker'];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad-json' }, { status: 400 });
  }

  const firstName = truncate(body.firstName, 80).trim();
  const lastName = truncate(body.lastName, 80).trim();
  const email = truncate(body.email, 160).trim();
  const phone = truncate(body.phone, 20).replace(/\D/g, '');
  const city = truncate(body.city, 80).trim();
  const country = truncate(body.country, 2).trim().toLowerCase();

  if (!firstName || !lastName || !email || !phone || !city || !country) {
    return NextResponse.json({ ok: false, reason: 'missing-fields' }, { status: 400 });
  }

  const rawOccupation = truncate(body.occupation, 32).trim() as Occupation;
  const occupation = OCCUPATIONS.includes(rawOccupation) ? rawOccupation : undefined;

  const utm = (body.utm ?? {}) as Record<string, string | undefined>;

  /* Identity and timestamp for the fulfilment record. `createdAt` means "when
     this person submitted their details", which is this request and nothing
     later. */
  const leadId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  /* Read from HEADERS, never from the request body: the browser cannot know
     its own IP, and a user agent sent up in JSON is trivially forged. */
  const clientIp = readClientIp(req);
  const clientUserAgent = readClientUserAgent(req);

  const eventSourceUrl = FUNNEL_CONFIG.fallbackEventSourceUrl;
  if (!siteUrlReady()) {
    console.error(
      '[register] NEXT_PUBLIC_SITE_URL is unset, so event_source_url is empty on this Lead',
    );
  }

  const externalId = truncate(body.externalId, 64);
  const fbc = truncate(body.fbc);
  const fbp = truncate(body.fbp);

  /* ── 1 · FULFILMENT, before anything else. ─────────────────────────── */
  const pabbly = pabblyReady()
    ? await sendPabblyLead({
        leadId,
        createdAt,
        firstName,
        lastName,
        email,
        phone,
        city,
        countryCode: country,
        fbc,
        fbp,
        clientIp,
        clientUserAgent,
        externalId,
        eventSourceUrl: eventSourceUrl ? `${eventSourceUrl}/register` : '',
        isTest: isTestMode(),
        /* The same id sent to Meta as the Lead event_id. */
        leadEventId: leadId,
        utmSource: truncate(utm.source, 100),
        utmMedium: truncate(utm.medium, 100),
        utmCampaign: truncate(utm.campaign, 100),
        utmContent: truncate(utm.content, 100),
        utmTerm: truncate(utm.term, 100),
        fbclid: truncate(body.fbclid, 200),
        referrer: truncate(body.referrer, 200),
        landingUrl: truncate(body.landingUrl, 300),
        product: FUNNEL_CONFIG.contentName,
        occupation: occupation ?? '',
      })
    : { ok: false, status: 0 };

  /* LOUD, not silent. Unset, every registration on this build is lost, and
     nothing else in the system would ever say so. */
  if (!pabblyReady()) {
    console.error('[register] PABBLY_WEBHOOK_URL is unset: this registration was NOT recorded anywhere');
  } else if (!pabbly.ok) {
    console.error(`[register] pabbly rejected the record http=${pabbly.status} lead=${leadId}`);
  }

  /* ── 2 · META. The conversion. ─────────────────────────────────────── */
  const capi = capiReady()
    ? await sendCapiEvent({
        pixelId: FUNNEL_CONFIG.meta.pixelId,
        accessToken: FUNNEL_CONFIG.meta.accessToken,
        eventName: 'Lead',
        /* The registration id: unique per person, and stable if this request is
           ever retried, so a retry cannot double-count the lead. */
        eventId: leadId,
        eventSourceUrl,
        user: {
          email,
          phone,
          firstName,
          lastName,
          country,
          city,
          externalId: externalId || undefined,
          fbc: fbc || undefined,
          fbp: fbp || undefined,
          /* Read from THIS request, which is the visitor's own browser. Worth
             roughly a point of EMQ between them. */
          clientIp: clientIp || undefined,
          clientUserAgent: clientUserAgent || undefined,
        },
        /* NO value and NO currency: the assessment is free, and a zero would
           report a transaction that never happened. custom_data on this event
           is the order id and nothing else, which is also everything the
           classification note in lib/meta-capi.ts allows. */
        orderId: leadId,
        occupation,
        testEventCode: FUNNEL_CONFIG.meta.testEventCode || undefined,
      })
    : { ok: false, status: 0, body: 'capi-not-configured' };

  if (!capiReady()) {
    console.warn('[register] CAPI not configured, Meta Lead not sent');
  }

  /* ── 3 · GA4. ──────────────────────────────────────────────────────── */
  const ga4 = ga4ServerReady()
    ? await sendGa4Lead({
        clientId: truncate(body.gaClientId, 64),
        leadId,
        itemId: FUNNEL_CONFIG.itemId,
        itemName: FUNNEL_CONFIG.contentName,
      })
    : { ok: false, status: 0 };

  console.log(
    `[register] ${leadId} Lead capi=${capi.ok} ga4=${ga4.ok} pabbly=${pabbly.ok}`,
  );

  return NextResponse.json({ ok: true, leadId, isTest: isTestMode() });
}
