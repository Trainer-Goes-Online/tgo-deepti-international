'use client';

import { useEffect } from 'react';

import { trackViewItem } from '@/lib/track';

/**
 * Landing-page tracking, mounted once on the page. Renders nothing.
 *
 * ONLY view_content lives here. atc_event does NOT: it fires from the
 * registration page's own mount, for two reasons.
 *
 *  1. This page carries seven CTA lockups. A reader who clicked two of them
 *     would count twice, which inflates atc_event volume and deflates the
 *     cost-per-atc_event the ads are judged on.
 *  2. A click is not an arrival. Counting the registration page's mount counts
 *     the people who actually reached it, and it is the only Meta event a
 *     visitor who opens /register directly will ever produce.
 *
 * Do not re-add it here: the two together double-count every ordinary visitor.
 */
export default function FunnelTracker() {
  useEffect(() => {
    /* view_content: the offer has been seen. Once per SESSION, not per browser
       lifetime, so a returning visitor still feeds the retargeting audience. */
    trackViewItem();
  }, []);

  return null;
}
