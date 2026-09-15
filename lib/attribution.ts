'use client';

/**
 * First-touch attribution, captured once and remembered.
 *
 * The problem this solves: reading the CURRENT url at the form returns
 * nothing. On /register there is no query string, because the visitor
 * navigated there from the landing page by clicking a link. So every UTM, the
 * fbclid and the referrer, the entire answer to "which ad produced this
 * registration", evaporates one click after arrival, and the record is written
 * with blank campaign fields. Every paid registration then reports as organic.
 *
 * So the campaign context is stamped into localStorage on FIRST landing, on
 * whichever page that happens to be, and read back at the form.
 *
 * Overwrite rule: a visit carrying a utm_source or an fbclid is a new ad click
 * and replaces what is stored. Last paid click wins, which is what the ad
 * account is judged on. A visit with neither (a direct return, a bookmark, an
 * organic search) leaves the stored campaign ALONE rather than blanking it.
 */

const KEY = 'dp_attr';

export type Attribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  fbclid: string;
  referrer: string;
  landingUrl: string;
};

const EMPTY: Attribution = {
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  utmContent: '',
  utmTerm: '',
  fbclid: '',
  referrer: '',
  landingUrl: '',
};

/* Capped at the point of CAPTURE, not at the point of sending.

   The India build has to: these values ride to its webhook inside Razorpay's
   order notes, which are capped at 256 characters per entry. Nothing here caps
   anything, and the caps are kept anyway. A landing url with five utm params
   and an fbclid on it routinely runs past 400 characters, and the place that
   receives these is a spreadsheet column somebody reads. A known trim at
   capture beats an unknown one downstream, and it keeps the two builds' Pabbly
   records the same shape. */
const CAP = {
  utm: 100,
  fbclid: 200,
  referrer: 200,
  landingUrl: 300,
} as const;

const cut = (v: string | null | undefined, max: number) =>
  (v ?? '').slice(0, max);

export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    const q = new URLSearchParams(window.location.search);
    const fbclid = q.get('fbclid') ?? '';
    const utmSource = q.get('utm_source') ?? '';

    /* Nothing to record and something already stored: leave it. */
    const stored = window.localStorage.getItem(KEY);
    if (stored && !utmSource && !fbclid) return;

    const next: Attribution = {
      utmSource: cut(utmSource, CAP.utm),
      utmMedium: cut(q.get('utm_medium'), CAP.utm),
      utmCampaign: cut(q.get('utm_campaign'), CAP.utm),
      utmContent: cut(q.get('utm_content'), CAP.utm),
      utmTerm: cut(q.get('utm_term'), CAP.utm),
      fbclid: cut(fbclid, CAP.fbclid),
      /* An INTERNAL referrer is not an acquisition source. Recording it would
         report every registration as coming from our own landing page. */
      referrer: isExternal(document.referrer)
        ? cut(document.referrer, CAP.referrer)
        : '',
      landingUrl: cut(window.location.href, CAP.landingUrl),
    };
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode or storage disabled: attribution is nice to have, never
       worth throwing into a page load */
  }
}

function isExternal(ref: string): boolean {
  if (!ref) return false;
  try {
    return new URL(ref).host !== window.location.host;
  } catch {
    return false;
  }
}

export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Attribution>) };
  } catch {
    return EMPTY;
  }
}
