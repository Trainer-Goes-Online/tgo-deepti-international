/**
 * GA4 Measurement Protocol: the server-side `generate_lead`.
 *
 * ── WHY THE LEAD IS SENT FROM THE SERVER AND NOT THE BROWSER ──────────
 * The India build sent `purchase` from the Razorpay webhook because a UPI
 * payer finishes inside their bank app and never returns to the tab. There is
 * no gateway here, so that particular hole is gone, and this is a deliberate
 * choice rather than an inherited one:
 *
 *   · the registration route is the only place the submission is PROVEN. A
 *     browser event fires on a click, which is not the same thing as a record
 *     that reached Pabbly.
 *   · it is sent once, from one place, so it cannot be double counted. GA4
 *     collapses two `purchase` hits sharing a transaction_id; it has no
 *     equivalent key for a lead, so a browser copy beside this one would
 *     simply count twice.
 *
 * client_id is the catch. GA4 attributes a server event to a session only if
 * it carries the _ga cookie's client id, so that value is read in the browser
 * and posted up with the form. Without it GA4 still records the lead, but as a
 * new unattributed session, which breaks the funnel view.
 */

const ENDPOINT = 'https://www.google-analytics.com/mp/collect';

export const ga4ServerReady = () =>
  Boolean(process.env.NEXT_PUBLIC_GA4_ID && process.env.GA4_API_SECRET);

export async function sendGa4Lead(params: {
  clientId: string;
  leadId: string;
  itemId: string;
  itemName: string;
}): Promise<{ ok: boolean; status: number }> {
  const measurementId = process.env.NEXT_PUBLIC_GA4_ID ?? '';
  const apiSecret = process.env.GA4_API_SECRET ?? '';
  if (!measurementId || !apiSecret) return { ok: false, status: 0 };

  const body = {
    /* A client_id is mandatory. Falling back to the lead id keeps the event
       rather than dropping it, at the cost of it landing as its own session. */
    client_id: params.clientId || `srv.${params.leadId}`,
    non_personalized_ads: false,
    events: [
      {
        name: 'generate_lead',
        params: {
          /* Not a GA4 reserved parameter, and that is fine: it is here so a
             row in the report can be traced back to a specific record in
             Pabbly and to the Meta event that shares the id. */
          lead_id: params.leadId,
          /* No value, no currency, no price. The assessment is free, and a
             zero here would put this funnel in GA4's revenue reporting as a
             row of nothing. The item identifies WHICH offer, which is not
             pricing. */
          items: [
            {
              item_id: params.itemId,
              item_name: params.itemName,
              quantity: 1,
            },
          ],
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `${ENDPOINT}?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
    // The MP endpoint returns 204 with no body on success.
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}
