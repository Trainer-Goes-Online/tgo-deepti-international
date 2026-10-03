import { SiteFooter } from '@/components/shared/SiteFooter';
import { site } from '@/lib/site';
import { Frieze, Symbol } from './Brand';
import { Cta } from './Cta';

export function Finale() {
  return (
    <>
      <section className="dv2-band dv2-finale">
        <Frieze />
        <div className="dv2-wrap dv2-narrow dv2-finale-in">
          <Symbol size={150} variant="reversed" className="dv2-finale-mark" />
          <h2 className="dv2-h2 is-light" data-sdp-reveal>
            Your liver doesn&apos;t need a cleanse. <em>It needs a plan.</em>
          </h2>
          <p className="dv2-sub is-light" data-sdp-reveal>
            Fifteen minutes. Your story, your reports, and an honest answer about whether this is
            right for you.
          </p>
          <Cta tone="turmeric" />
          <p className="dv2-cta-note is-light">{site.clientsPerMonth} new clients a month.</p>
        </div>
      </section>

      <div className="dv2-disclaimer">
        <p className="dv2-wrap dv2-narrow">
          Individual results vary. This programme provides nutrition and lifestyle guidance and does
          not replace medical care. It is not intended to diagnose, treat, cure or prevent any
          disease. Please consult your doctor before making changes to your diet, medication or
          exercise.
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
