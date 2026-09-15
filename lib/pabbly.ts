/**
 * Pabbly Connect: the fulfilment hand-off.
 *
 * Analytics tells Meta and GA4 that a registration happened. This tells the
 * automation WHO REGISTERED, so the person actually receives what they signed
 * up for: the link to book, the reminder to have their blood reports ready,
 * the row in a sheet that Deepti's team works from.
 *
 * ── THIS IS THE ONLY RECORD OF A REGISTRATION ON THIS BUILD ───────────
 * That is the difference from the India build, and it is the reason this file
 * matters more here than it did there. On that build a sale also existed in
 * Razorpay's dashboard: a second, independent copy of who bought, with an
 * email and a phone number against it, recoverable if anything downstream
 * failed. Nothing is charged here, so no gateway holds a copy. If this POST
 * does not land, the person has registered and nobody knows.
 *
 * So PABBLY_WEBHOOK_URL is not optional on this build in the way it was on
 * that one. Unset, the funnel still runs, still tracks and still books, and
 * every registration is lost.
 *
 * It is fired from /api/register, on the same request that sends the Meta Lead
 * event, and it is sent FIRST: fulfilment must never depend on analytics being
 * configured.
 *
 * Its own failure is reported to the caller and never thrown. A registration
 * that reached Meta but not Pabbly is worth logging loudly, not worth failing
 * the page for: the person is already through the form.
 *
 * ── Why this payload carries the Meta match keys too ──────────────────────
 * Pabbly is the ONLY place a full, unhashed record of a registration exists
 * anywhere. Meta receives hashes and nothing descriptive, and GA4 receives no
 * PII at all. So `fbc`, `fbp`, `client_ip_address`, `client_user_agent`,
 * `external_id` and `lead_event_id` ride along here as well. They are what
 * make it possible to rebuild, replay or reconcile a Meta event later from the
 * sheet, without which a mis-sent conversion is simply unrecoverable.
 *
 * ── NO `amount` AND NO `currency` IN THIS PAYLOAD ─────────────────────
 * The India build's record carries both, because there a sale happened. The
 * first version of this file kept `amount: 0` so the sheet's shape would match
 * across the two builds. It is gone: a money column full of zeroes on a free
 * funnel is a column somebody eventually sums.
 *
 * Never remove a key once Pabbly steps map it. Removing one does not error, it
 * silently blanks a column downstream. That is why these two went NOW, before
 * a single workflow has been built against this endpoint, rather than later.
 */
export const pabblyReady = () => Boolean(process.env.PABBLY_WEBHOOK_URL);

export type PabblyLead = {
  leadId: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  countryCode: string;
  fbc: string;
  fbp: string;
  clientIp: string;
  clientUserAgent: string;
  externalId: string;
  eventSourceUrl: string;
  isTest: boolean;
  leadEventId: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  fbclid: string;
  referrer: string;
  landingUrl: string;
  product: string;
  occupation: string;
};

/* Every key is emitted on every call, empty string where unknown. Pabbly
   builds its field mapper from the FIRST payload it sees, so a key that is
   merely absent on the first test call cannot be mapped afterwards without
   re-running the trigger. An omitted key is far more expensive here than an
   empty one. */
const s = (v: unknown) => (v == null ? '' : String(v));

export async function sendPabblyLead(
  p: PabblyLead,
): Promise<{ ok: boolean; status: number }> {
  const url = process.env.PABBLY_WEBHOOK_URL ?? '';
  if (!url) return { ok: false, status: 0 };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      /* FLAT keys, one level deep. Pabbly maps fields one level deep, and a
         nested object arrives as an unusable blob in the step mapper. */
      body: JSON.stringify({
        lead_id: s(p.leadId),
        created_at: s(p.createdAt),
        first_name: s(p.firstName),
        last_name: s(p.lastName),
        email: s(p.email),
        phone: s(p.phone),
        city: s(p.city),
        country_code: s(p.countryCode),
        fbc: s(p.fbc),
        fbp: s(p.fbp),
        client_ip_address: s(p.clientIp),
        client_user_agent: s(p.clientUserAgent),
        external_id: s(p.externalId),
        event_source_url: s(p.eventSourceUrl),
        /* A real boolean, not the string "false": a Pabbly router condition on
           a non-empty string treats "false" as true and would route live
           registrations down the test branch. */
        is_test: Boolean(p.isTest),
        /* The same id sent to Meta as the Lead event_id, so a conversion can be
           traced from the sheet back to a specific row in Events Manager, or
           replayed against it. */
        lead_event_id: s(p.leadEventId),
        utm_source: s(p.utmSource),
        utm_medium: s(p.utmMedium),
        utm_campaign: s(p.utmCampaign),
        utm_content: s(p.utmContent),
        utm_term: s(p.utmTerm),
        fbclid: s(p.fbclid),
        referrer: s(p.referrer),
        landing_url: s(p.landingUrl),

        event: 'registration',
        name: `${s(p.firstName)} ${s(p.lastName)}`.trim(),
        product: s(p.product),
        occupation: s(p.occupation),
      }),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}
