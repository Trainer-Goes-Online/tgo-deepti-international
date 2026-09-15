'use client';

import { collectSignals } from '@/lib/client-signals';
import {
  ga4AddToCart,
  ga4BeginCheckout,
  ga4BookingConfirmed,
  ga4ViewItem,
  once,
  type Ga4Item,
} from '@/lib/ga4';

/**
 * The one place a page calls to record something. Each function fires the
 * matching STANDARD event on both platforms: Meta by name via the CAPI route,
 * GA4 by its own recommended name.
 *
 * ── WHAT IS NOT IN THIS FILE, AND WHY ─────────────────────────────────
 * The conversion itself. `Lead` and GA4's `generate_lead` are sent from
 * /api/register, server side, on the request that also writes the record to
 * Pabbly. A browser copy would fire on a click rather than on a registration
 * that actually landed, and GA4 has no dedup key for a lead, so the two would
 * count twice. Everything left in here is a STEP, not a conversion.
 *
 * ── NO MONEY ON ANY EVENT ─────────────────────────────────────────────
 * No value, no currency, no price. Not even a zero: a zero is still a figure,
 * it still lands this funnel in revenue reporting, and the first version of
 * this file sent one. Atul, 2026-09-15: "its for free so no pricing would be
 * needed." An event that carries a number because the India build carries one
 * is an event teaching the ad account to buy against revenue that does not
 * exist.
 */

/* GA4 only, and identity only. The item name never reaches Meta: see
   lib/funnel-config.ts. */
const ITEM: Ga4Item = {
  item_id: 'deepti-assessment-intl',
  item_name: 'Free Personalised Health Assessment',
  quantity: 1,
};
const offer = { items: [ITEM] };

/** Fire-and-forget: analytics must never block or fail a click. */
function capi(eventName: string, extra: Record<string, unknown> = {}) {
  const s = collectSignals();
  try {
    void fetch('/api/meta/event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ eventName, ...s, ...extra }),
      keepalive: true, // survives the navigation a CTA click causes
    });
  } catch {
    /* ignore */
  }
}

/** Landing page: the offer has been seen. Once per SESSION. */
export function trackViewItem() {
  once('view_item', () => {
    capi('ViewContent');
    ga4ViewItem(offer);
  });
}

/**
 * Registration page ARRIVAL, named for the Meta event it sends.
 *
 * It fires from the registration page's MOUNT and from nowhere else. Do not
 * move it back onto a landing-page CTA click listener: that page carries seven
 * CTA lockups, so a reader who taps two of them counts twice, which inflates
 * the volume and deflates the cost-per-step the ads are judged on. A click is
 * also not an arrival.
 *
 * It is also the ONLY Meta event a DIRECT arrival ever produces. Someone who
 * opens /register from an email, a retargeting ad or a bookmark never touches
 * the landing page and would be invisible until they submit.
 *
 * The name is Meta's cart vocabulary on a funnel with no cart, and it is kept
 * anyway: it is a standard event, it carries Aggregated Event Measurement
 * priority, and it is the mid-funnel step every optimisation prior in the ad
 * account is already built on. The alternative was a second ViewContent, which
 * Meta would collapse into the landing page's own.
 */
export function trackAddToCart() {
  capi('AddToCart');
  ga4AddToCart(offer);
}

/** The registration page has loaded. GA4's half of the arrival. */
export function trackBeginCheckout() {
  ga4BeginCheckout(offer);
}

/**
 * The booking is confirmed inside Cal's embed.
 *
 * Meta's `Schedule` and GA4's custom `booking_confirmed`, and the last event
 * on the funnel. It is fired from the BROWSER, which is a compromise worth
 * stating: Cal's embed message is the only booking signal this build receives,
 * because no Cal webhook is wired to a route here. That makes it the one event
 * on the build a determined stranger could post by hand, which is why `Lead`,
 * the event campaigns should optimise against, is not one of them.
 *
 * Keyed on the registration id, durably, so a refresh or a back-navigation on
 * the confirmation page cannot count the booking twice.
 */
export function trackBookingConfirmed(leadId: string) {
  const key = leadId || 'anon';
  once(`booking_${key}`, () => {
    capi('Schedule', { orderId: leadId || undefined });
    ga4BookingConfirmed({ bookingId: key, ...offer });
  });
}
