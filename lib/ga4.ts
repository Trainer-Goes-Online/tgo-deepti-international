'use client';

/**
 * GA4 events. Recommended names wherever one fits, so the built-in funnel
 * reports populate with no custom configuration.
 *
 * ── NO MONEY IS SENT AT ALL ───────────────────────────────────────────
 * The India build sends the ninety-seven rupee fee on every event. This one
 * sends no `value`, no `currency` and no item `price`. Zero was the first
 * answer and it was the wrong one: a value of 0 against a currency still puts
 * this funnel in GA4's revenue reporting, as rows of $0 sitting beside a real
 * funnel's takings, and somebody reading a blended report later has to work
 * out which zeroes are free assessments and which are broken tracking.
 *
 * The `items` array stays, with an id and a name and nothing else. It is what
 * identifies WHICH offer was viewed, which is not pricing.
 *
 * All failures are swallowed: analytics must never throw into a click.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type Ga4Item = {
  item_id: string;
  item_name: string;
  quantity: number;
};

type Payload = { items?: Ga4Item[] };

function send(name: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
      return;
    }
    /* gtag.js has not finished loading. Queue onto dataLayer exactly as gtag
       itself would, by pushing the `arguments` object, so the tag replays the
       event when it initialises. Dropping it here instead would lose every
       event fired by an effect that beat the afterInteractive script, which is
       a race we would only ever notice as quietly missing top-of-funnel data. */
    window.dataLayer = window.dataLayer || [];
    function gtagShim() {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer as unknown[]).push(arguments);
    }
    (gtagShim as (...args: unknown[]) => void)('event', name, params);
  } catch {
    /* never throw into a click */
  }
}

const payload = (m: Payload) => ({ ...(m.items && { items: m.items }) });

export const ga4ViewItem = (m: Payload) => send('view_item', payload(m));
export const ga4AddToCart = (m: Payload) => send('add_to_cart', payload(m));
export const ga4BeginCheckout = (m: Payload) => send('begin_checkout', payload(m));

/**
 * The booking is confirmed inside Cal's embed.
 *
 * A CUSTOM name, and the only one on this build. GA4 has no recommended event
 * for an appointment, and bending `purchase` over a free booking would put a
 * row in the revenue report for money that never moved.
 *
 * `generate_lead` is deliberately NOT here. It is sent once, server side, from
 * /api/register, where the registration is proven. A browser copy would double
 * count it: GA4 collapses two `purchase` hits on one transaction_id, but it has
 * no equivalent key for a lead, so both would be counted.
 */
export const ga4BookingConfirmed = (m: Payload & { bookingId: string }) =>
  send('booking_confirmed', { booking_id: m.bookingId, ...payload(m) });

/* Some events should fire once rather than on every call. The flag is stamped
   BEFORE the call so a rapid double-click or a tab closed mid-navigation still
   dedupes. */
export function once(key: string, fire: () => void) {
  if (typeof window === 'undefined') return;

  /* THIS GATE DELIBERATELY DOES NOT CHECK FOR window.gtag.
     trackViewItem fires Meta's ViewContent from inside this callback. On a
     previous build the gtag check lived here, the project had no GA4 base tag,
     so the check never passed, so the callback never ran, and META'S
     ViewContent NEVER FIRED AT ALL. The Meta top-of-funnel event was killed by
     a missing Google tag, and the failure is invisible from both sides. Meta
     must never go dark because GA4 is misconfigured. GA4's own send() queues
     onto dataLayer safely on its own. */

  /* A booking must never be counted twice for the same registration, so those
     keys are remembered for the life of the browser: a confirmation page is
     exactly the kind of url people refresh and re-open. Everything else is a
     per-SESSION guard: a durable view_item key means a returning visitor
     generates no ViewContent ever again, which starves the retargeting
     audience and shrinks the optimisation signal. */
  const durable = key.startsWith('booking_');
  const k = `dp_ga4_${key}`;
  try {
    const store = durable ? window.localStorage : window.sessionStorage;
    if (store.getItem(k)) return;
    store.setItem(k, '1');
  } catch {
    /* private mode: fire anyway rather than lose the event */
  }
  fire();
}
