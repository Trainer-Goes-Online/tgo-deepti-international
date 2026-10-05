import './v3.css';

import FunnelTracker from '@/components/shared/FunnelTracker';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { SiteFooter } from '@/components/shared/SiteFooter';
import { TopBar } from '@/components/v3/TopBar';
import { Hero } from '@/components/v3/Hero';
import { ForYou } from '@/components/v3/ForYou';
import { Proof } from '@/components/v3/Proof';
import { Wins } from '@/components/v3/Wins';
import { ApproachImage, Coach } from '@/components/v3/Coach';
import { Faq } from '@/components/v3/Faq';

/* Copy: October 2026 update. Look: thedoordieexperience.com in the Deepti brand teal. */
export default function LandingPage() {
  return (
    <main className="v3-root">
      <FunnelTracker />
      <ScrollReveal />
      <TopBar />
      <Hero />
      <ForYou />
      <Proof />
      <Wins />
      <Coach />
      <ApproachImage />
      <Faq />
      <p className="v3-disclaimer">
        Individual results vary. This programme provides nutrition and lifestyle guidance and does
        not replace medical care. It is not intended to diagnose, treat, cure or prevent any disease.
        Please consult your doctor before making changes to your diet, medication or exercise.
      </p>
      <SiteFooter />
    </main>
  );
}
