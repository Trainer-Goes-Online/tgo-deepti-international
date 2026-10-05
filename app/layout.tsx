import type { Metadata } from 'next';
import {
  Montserrat,
  Open_Sans,
  Fraunces,
  Hanken_Grotesk,
  IBM_Plex_Mono,
  Manrope,
  Marcellus,
  Spectral,
  Tiro_Devanagari_Sanskrit,
} from 'next/font/google';
import './globals.css';

import Analytics from '@/components/shared/Analytics';
import MetaPixel from '@/components/shared/MetaPixel';

/* THREE VOICES (design-system.base.md, C1). The aqua build ran two sans and
   no mono, which is the base file's first-listed failure mode and the reason
   the page read cheap rather than clinical.

   DISPLAY = Fraunces, a high-contrast editorial serif. Stroke contrast is what
   actually reads expensive; weight does not. This reverses the earlier
   Oswald-to-Jakarta call, and deliberately: that call was made to move AWAY
   from the editorial register, back when the palette was aqua and coral. The
   palette is now bone and ink, so the register it was avoiding is the target. */
const display = Fraunces({
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

/* SPEC = IBM Plex Mono. The credibility voice, and the one this page was
   missing most: it is 40% lab data (HbA1c, LDL, fatty liver grades, 700+,
   12wk, 5.0). Mono makes a number read as a measurement instead of a
   marketing figure, and it is what the fourth credibility card leans on now
   that the card reads FREE instead of a price. Plex specifically because it is the report-paper mono,
   not a code-editor one. */
const mono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

/* BODY = Manrope. Unchanged. The neutral voice stays neutral. */
const manrope = Manrope({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

/* Landing page faces (v2), per the brand typography sheet:
   written = Spectral, carved = Marcellus, measured = Hanken Grotesk. */
const v2Serif = Spectral({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-v2-serif',
  display: 'swap',
});
const v2Label = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-v2-label',
  display: 'swap',
});
const v2Body = Hanken_Grotesk({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-v2-body',
  display: 'swap',
});
/* Funnel pages: the standard direct-response pairing, Montserrat heads + Open Sans body. */
const v3Head = Montserrat({
  weight: ['700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-v3-head',
  display: 'swap',
});
const v3Body = Open_Sans({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-v3',
  display: 'swap',
});
const v2Sanskrit = Tiro_Devanagari_Sanskrit({
  weight: '400',
  subsets: ['devanagari'],
  variable: '--font-v2-sanskrit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Improve fatty liver. Lose the stubborn weight. Keep the chai.',
  description:
    "A one-to-one, 12-week programme where Ayurveda's wisdom about digestion meets modern functional nutrition, with Deepti in the middle making them agree. Built around your food, your routine and your reports.",
  robots: { index: false, follow: false }, // pre-launch: assets + figures not yet final
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${manrope.variable} ${v2Serif.variable} ${v2Label.variable} ${v2Body.variable} ${v2Sanskrit.variable} ${v3Head.variable} ${v3Body.variable}`}
    >
      <body>
        {children}

        {/* ── TAGS, MOUNTED HERE AND NOWHERE ELSE ───────────────────────
            Both render nothing when their env ids are missing, so an
            unfilled variable leaves no broken script tag behind.

            They mount in the ROOT layout rather than on the landing page
            because both have work to do on every surface. MetaPixel also
            captures first-touch attribution and the _fbc cookie, and it
            does that ABOVE its own pixel-id guard: a retargeting ad or an
            email can drop somebody straight onto /register, and that visit
            is the only one carrying the campaign. Attribution must not go
            dark because a pixel id is unset.

            Analytics is the GA4 base tag. It is part of this build and not
            a snippet somebody pastes in later, because every GA4 call in
            lib/ga4.ts checks for window.gtag and returns quietly when it is
            absent: without a base tag the whole browser funnel silently
            does nothing while /api/register keeps reporting leads through
            the Measurement Protocol, and GA4 then shows conversions with no
            funnel above them. That is harder to spot than an empty property,
            not easier. ────────────────────────────────────────────────── */}
        <MetaPixel />
        <Analytics />
      </body>
    </html>
  );
}
