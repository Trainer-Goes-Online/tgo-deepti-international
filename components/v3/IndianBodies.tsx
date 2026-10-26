import { asset } from '@/components/shared/asset-version';

export function IndianBodies() {
  return (
    <section className="v3-section v3-indian">
      <div className="v3-wrap">
        <h2 className="v3-h2" data-sdp-reveal>
          Why Indian Bodies Need A Different <br className="v3-br" />
          Metabolic Strategy
        </h2>
        {/* Tapping opens the full-size infographic, for reading its small labels on a phone. */}
        <a className="v3-indian-img" href={asset('/indian-bodies.webp')} target="_blank" rel="noopener" data-sdp-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset('/indian-bodies.webp')}
            alt="South Asians can develop metabolic problems at lower body weights and BMI levels, tend to carry more visceral fat around organs like the liver, so fatty liver, rising blood sugar and cholesterol can show up before the scale looks concerning. Add life in the US &amp; Canada: work routines, eating out, Indian food habits and changing meal patterns. That's why Deepti's approach combines Ayurveda and functional nutrition with your Indian roots and life in the US &amp; Canada."
            width={1024}
            height={1536}
            loading="lazy"
            decoding="async"
          />
        </a>
      </div>
    </section>
  );
}
