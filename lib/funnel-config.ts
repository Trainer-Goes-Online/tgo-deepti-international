/**
 * Every server-side constant the tracking and registration routes need, in one
 * place.
 *
 * ── WHAT CHANGED FROM THE INDIA BUILD ─────────────────────────────────
 * There is no `razorpay` block, no price, no value and no currency. The first
 * version of this file declared a value of 0 against USD, on the reasoning
 * that a zero is the truth about a free assessment. Atul, 2026-09-15: "its for
 * free so no pricing would be needed." He is right, and the zero was worse
 * than nothing: it is still a figure, it still lands the funnel in the revenue
 * reporting of both platforms, and a currency beside it still announces a
 * transaction that never happens.
 *
 * So no money is declared here and none is sent anywhere. What is left is
 * IDENTITY: which offer, under which id. If a paid step is ever added, it gets
 * declared in this object and nowhere else, the way the fee is on the India
 * build.
 */

/**
 * ⚠️ NO LIVE DOMAIN HAS BEEN SUPPLIED FOR THIS BUILD.
 *
 * This value is sent to Meta as event_source_url, so a wrong default would
 * quietly attribute live events to a domain the client does not own. Rather
 * than invent one, the fallback is empty and `siteUrlReady()` below is checked
 * by the routes that need it, which log loudly instead of failing silently.
 *
 * The India build's domain is NOT a valid fallback here. A shared
 * event_source_url across two funnels merges them in Events Manager.
 *
 * `||`, not `??`. A host that defines the key with a BLANK value yields an
 * empty string, which `??` passes straight through, and an empty
 * event_source_url is silently worthless to Meta.
 */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '');

export const siteUrlReady = () => Boolean(SITE_URL);

export const FUNNEL_CONFIG = {
  /**
   * The product label. Used for the GA4 item name and the Pabbly record.
   *
   * DELIBERATELY NEUTRAL, and it never reaches Meta. See the classification
   * note at the top of lib/meta-capi.ts: a descriptive product string in
   * custom_data on a domain selling against diabetes, fatty liver and thyroid
   * is the surface that gets a dataset classified, and the classification
   * binds at the root domain. GA4 is not that surface, so the label is honest
   * there and simply absent from every Meta payload.
   */
  contentName: 'Free Personalised Health Assessment',
  /** GA4 item_id. Opaque, stable, no condition word. */
  itemId: 'deepti-assessment-intl',
  fallbackEventSourceUrl: SITE_URL,
  meta: {
    pixelId: process.env.META_PIXEL_ID ?? '',
    accessToken: process.env.META_CAPI_ACCESS_TOKEN ?? '',
    testEventCode: process.env.META_CAPI_TEST_EVENT_CODE ?? '',
  },
} as const;

/** True only when a real CAPI call can be made. Routes check this and skip
 *  quietly rather than posting to Meta with an empty pixel id. */
export const capiReady = () =>
  Boolean(FUNNEL_CONFIG.meta.pixelId && FUNNEL_CONFIG.meta.accessToken);

/**
 * Whether this deployment is registering test leads rather than real ones.
 *
 * The India build derived this from Razorpay's own key prefix, which cannot
 * drift. There is no gateway here, so the one honest signal left is the Meta
 * test event code: events sent with one do not count toward optimisation, and
 * the lead they describe is not a real person.
 *
 * It rides to Pabbly as `is_test` so a staging registration can be routed away
 * from the live fulfilment instead of putting a fictional client into Deepti's
 * assessment queue.
 */
export const isTestMode = () => Boolean(FUNNEL_CONFIG.meta.testEventCode);
