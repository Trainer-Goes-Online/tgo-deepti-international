import { site } from '@/lib/site';
import { ChakraFull } from './Brand';
import { Cta } from './Cta';

const VIMEO_ID = '1224198548';

export function Hero() {
  return (
    <section className="dv2-hero">
      <div className="dv2-wrap dv2-hero-in">
        <p className="dv2-pill" data-sdp-reveal>
          <span className="dv2-pill-dot" aria-hidden />
          For adults whose liver, weight and lab reports have started a group chat. Without you.
        </p>

        <h1 className="dv2-h1" data-sdp-reveal style={{ '--d': '.06s' } as React.CSSProperties}>
          Improve fatty liver. Lose the stubborn weight. <em>Keep the chai.</em>
        </h1>

        <p className="dv2-lede" data-sdp-reveal style={{ '--d': '.12s' } as React.CSSProperties}>
          A one-to-one, 12-week programme where Ayurveda&apos;s wisdom about digestion meets modern
          functional nutrition, with Deepti in the middle making them agree. Built around your food,
          your routine and your reports.
        </p>

        <div className="dv2-step" data-sdp-reveal style={{ '--d': '.16s' } as React.CSSProperties}>
          <p className="dv2-label">Step 1: Press play.</p>
          <div className="dv2-arch" id="vsl">
            <div className="dv2-arch-in">
              <ChakraFull />
              <div className="dv2-vsl">
                <iframe
                  src={`https://player.vimeo.com/video/${VIMEO_ID}?title=0&byline=0&portrait=0`}
                  title="Watch the short video"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="dv2-arch-cap">Two minutes, zero lectures.</p>
            </div>
          </div>
        </div>

        <div className="dv2-step" data-sdp-reveal>
          <p className="dv2-label">Step 2: Book a 15-minute Clarity Call.</p>
          <p className="dv2-step-text">Bring your reports. No reports? Bring your story.</p>
          <Cta />
          <p className="dv2-cta-note">
            {site.clientsPerMonth} new clients a month. Video call, wherever you are.
          </p>
        </div>
      </div>
    </section>
  );
}
