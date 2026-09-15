/**
 * Central site config.
 *
 * ── THIS IS THE INTERNATIONAL BUILD. THE ASSESSMENT IS FREE. ───────────
 * The India build (`tgo-deepti`) sells the assessment for ₹97 through
 * Razorpay. This one charges nothing: there is no gateway, no order, no
 * receipt and no refund of a fee, and the next click after the landing page
 * is a registration form rather than a payment sheet.
 *
 * Everything that used to derive from a price is simply GONE. There is no
 * fee, no fee label and no value exported from here, because there is nothing
 * to pay: Atul, 2026-09-15, "its for free so no pricing would be needed".
 *
 * The single-source law that governed the price still governs its absence. If
 * a figure is ever introduced on this build, it gets declared here and nowhere
 * else, the way `feeInr` is on the India build. Two sources drift, and the
 * drift stays invisible until two places on a live page disagree about what
 * the reader is being asked for.
 */
export const site = {
  /** The next click after every CTA on the landing page. */
  registerUrl: '/register',
  /** Countdown window for the offer urgency, per the copy: 5 hours. */
  offerHours: 5,
};

/**
 * BUSINESS + LEGAL FACTS. Client-supplied 2026-09-08, verbatim.
 *
 * This is the SINGLE SOURCE for the legal pages (/privacy, /terms, /refund),
 * the colophon and the site footer. Nothing here is inferred: every field came
 * from the client. If a legal page needs a fact that is not in this object, it
 * does not get invented, it gets asked.
 *
 * The registered entity is Indian and stays Indian on this build: the same
 * practitioner is serving clients abroad, which is a different AUDIENCE, not a
 * different business. Nobody has supplied an overseas entity, so none is
 * invented here.
 */
export const business = {
  /** Registered entity. A proprietor, not a private limited company. */
  legalName: 'Deepti Sherawat',
  /** Trading name, as given. */
  tradingName: '"Liver First" - 90 days holistic wellness program',
  address: {
    line1: 'Sector 21',
    city: 'Noida',
    state: 'Uttar Pradesh',
    stateShort: 'U.P.',
    pin: '201301',
    country: 'India',
  },
  phone: '9289049674',
  phoneE164: '+919289049674',
  email: 'deeptiofficialsherawat@gmail.com',
  /** Governing law + venue for the terms page. */
  jurisdictionState: 'Uttar Pradesh',
} as const;

/** One-line postal address for footers and legal pages. */
export const addressLine = [
  business.address.line1,
  business.address.city,
  business.address.pin,
  business.address.stateShort,
].join(', ');

export const CTA_LABEL =
  'Click Here To Get Your Personalised Weight Loss & Metabolic Health Plan';
