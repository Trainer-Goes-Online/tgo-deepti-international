import { asset } from '@/components/shared/asset-version';
import { Cta } from './Cta';

export function Coach() {
  return (
    <section className="v3-section v3-coach">
      <div className="v3-wrap">
        <p className="v3-eyebrow" data-sdp-reveal>
          Meet Your Coach
        </p>
        <h2 className="v3-h2" data-sdp-reveal>
          Where Ayurveda Meets <br className="v3-br" />
          Functional Nutrition
        </h2>

        <div className="v3-coach-grid">
          <figure className="v3-coach-photo" data-sdp-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/deepti.webp')} alt="Deepti Sherawat" width={800} height={1000} loading="lazy" decoding="async" />
          </figure>

          <div className="v3-coach-text" data-sdp-reveal>
            <p className="v3-coach-name">DEEPTI SHERAWAT</p>
            <p>
              For over 10 years and 700+ client journeys worldwide, Deepti Sherawat has worked at the
              intersection of Ayurveda, nutrition and metabolic health.
            </p>
            <p>
              Her approach goes beyond generic diet plans by looking at how digestion, lifestyle, food
              patterns, body type and health markers may be connected.
            </p>
            <p>
              By combining Ayurvedic principles with functional nutrition, she builds personalised
              plans designed around the person rather than just the condition.
            </p>
            <p>
              Her work has earned her recognition as Top Nutritionist at Cult Fit, a place on the
              Advisory Board at AAFT School of Health &amp; Wellness, and the opportunity to lead
              Hormonal &amp; Liver Detox programmes at Habuild.
            </p>
            <p>
              Today, Deepti and her qualified team support clients globally with a more connected
              approach to fatty liver, weight and metabolic health.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ApproachImage() {
  return (
    <section className="v3-section v3-approach">
      <div className="v3-wrap">
        <h2 className="v3-h2" data-sdp-reveal>
          The Approach Behind 700+ <br className="v3-br" />
          Client Health Journeys Across The World
        </h2>
        {/* Tapping opens the full-size diagram, for reading its small labels on a phone. */}
        <a className="v3-approach-scroll" href={asset('/approach.webp')} target="_blank" rel="noopener" data-sdp-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset('/approach.webp')}
            alt="Ayurveda (digestion, body type, food compatibility, daily rhythm, root imbalances) and functional nutrition (nutrient needs, food quality, lifestyle habits, lab markers, targeted support) combine into your personalised plan for better liver health, healthier weight, better digestion and better metabolic markers."
            width={1801}
            height={873}
            loading="lazy"
            decoding="async"
          />
        </a>
        <Cta />
      </div>
    </section>
  );
}
