import './v2.css';

import FunnelTracker from '@/components/shared/FunnelTracker';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Header } from '@/components/v2/Header';
import { Hero } from '@/components/v2/Hero';
import { ForYou } from '@/components/v2/ForYou';
import { Approach } from '@/components/v2/Approach';
import { HowItWorks } from '@/components/v2/HowItWorks';
import { Results } from '@/components/v2/Results';
import { Coach } from '@/components/v2/Coach';
import { Faq } from '@/components/v2/Faq';
import { Finale } from '@/components/v2/Finale';

/* Copy: funnel-copy v2 (October 2026). Look: Intl_landing_page_v2_mobile.png. */
export default function LandingPage() {
  return (
    <main className="dv2-root">
      <FunnelTracker />
      <ScrollReveal />
      <Header />
      <Hero />
      <ForYou />
      <Approach />
      <HowItWorks />
      <Results />
      <Coach />
      <Faq />
      <Finale />
    </main>
  );
}
