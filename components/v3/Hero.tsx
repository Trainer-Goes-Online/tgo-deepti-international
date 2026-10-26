import { Cta } from './Cta';

const VIMEO_ID = '1224198548';

export function Hero() {
  return (
    <section className="v3-hero">
      <div className="v3-wrap">
        <p className="v3-eyebrow" data-sdp-reveal>
          For Indians In The US&nbsp;&amp;&nbsp;Canada Dealing With Fatty Liver, Excess Weight <br className="v3-br" />
          Or Worsening Health Markers
        </p>
        <h1 className="v3-h1" data-sdp-reveal style={{ '--d': '.06s' } as React.CSSProperties}>
          Improve Fatty Liver <br className="v3-br" />
          &amp; Lose Stubborn Weight <br className="v3-br" />
          <em className="v3-h1-em">
            &amp; Get A Plan That Fits <br className="v3-br" />
            Your Indian Roots &amp; Western Life
          </em>
        </h1>
        <p className="v3-lede" data-sdp-reveal style={{ '--d': '.12s' } as React.CSSProperties}>
          A personalised 12-week programme combining <strong>Ayurveda + functional nutrition</strong>{' '}
          to account for the way <strong>South Asian bodies</strong>,{' '}
          <strong>Indian eating patterns and life in the US&nbsp;&amp;&nbsp;Canada</strong> can shape your metabolic health.
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
