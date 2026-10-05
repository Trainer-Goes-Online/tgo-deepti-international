import { Cta } from './Cta';

const VIMEO_ID = '1224198548';

export function Hero() {
  return (
    <section className="v3-hero">
      <div className="v3-wrap">
        <p className="v3-eyebrow" data-sdp-reveal>
          For Adults With Fatty Liver, Excess Weight Or Worsening Health Markers
        </p>
        <h1 className="v3-h1" data-sdp-reveal style={{ '--d': '.06s' } as React.CSSProperties}>
          Improve Fatty Liver, <br className="v3-br" />
          Lose Stubborn Weight &amp; <br className="v3-br" />
          Get Your Health Back On Track
        </h1>
        <p className="v3-lede" data-sdp-reveal style={{ '--d': '.12s' } as React.CSSProperties}>
          A personalised 12-week programme combining Ayurveda + functional nutrition to work on your
          liver, weight and metabolic health together, with a plan built around your food,
          lifestyle, health markers and individual needs.
        </p>

        <p className="v3-step">
          <u>STEP 1</u>: WATCH THIS SHORT VIDEO TO SEE HOW THE PROGRAM WORKS👇
        </p>
        <div className="v3-vsl" id="vsl">
          <iframe
            src={`https://player.vimeo.com/video/${VIMEO_ID}?title=0&byline=0&portrait=0`}
            title="Watch the short video"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>

        <p className="v3-step">
          <u>STEP 2</u>: BOOK A CALL BELOW AND ANSWER A FEW QUESTIONS👇
        </p>
        <Cta />
      </div>
    </section>
  );
}
