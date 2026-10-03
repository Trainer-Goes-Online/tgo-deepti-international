import { Symbol } from './Brand';

const AYURVEDA = [
  'How strong your digestive fire is (Ayurveda calls it agni)',
  'Your body type',
  'Which foods suit you, and which quietly don’t',
  'When you eat, sleep and move: your daily rhythm',
];

const FUNCTIONAL = [
  'What your blood reports and scans actually say',
  'Which nutrients you’re missing',
  'Food quality, protein and fibre',
  'Targeted supplements, only when your labs ask for them',
];

export function Approach() {
  return (
    <section className="dv2-section dv2-approach">
      <div className="dv2-wrap dv2-narrow">
        <p className="dv2-label" data-sdp-reveal>
          The approach
        </p>
        <h2 className="dv2-h2" data-sdp-reveal>
          Two wise traditions. <em>One very practical woman in the middle.</em>
        </h2>
        <p className="dv2-sr">Ayurveda asks why. Science asks how much. Deepti asks what’s for lunch.</p>

        {/* The copy's three-part line is split across the circles it describes. */}
        <div className="dv2-venn" data-sdp-reveal aria-hidden>
          <svg className="dv2-venn-svg" viewBox="0 0 560 340">
            <defs>
              <clipPath id="dv2-venn-left">
                <circle cx="200" cy="170" r="168" />
              </clipPath>
            </defs>
            <circle cx="200" cy="170" r="168" fill="var(--dv2-venn-l)" />
            <circle cx="360" cy="170" r="168" fill="var(--dv2-venn-r)" />
            <circle cx="360" cy="170" r="168" fill="var(--dv2-venn-mid)" clipPath="url(#dv2-venn-left)" />
            <circle cx="200" cy="170" r="168" fill="none" stroke="var(--dv2-teal)" strokeWidth="2.5" />
            <circle cx="360" cy="170" r="168" fill="none" stroke="var(--dv2-turmeric)" strokeWidth="2.5" />
          </svg>
          <div className="dv2-venn-c is-left">
            <span className="dv2-venn-t">Ayurvedic roots</span>
            <span className="dv2-venn-s">asks why</span>
          </div>
          <div className="dv2-venn-c is-right">
            <span className="dv2-venn-t">Functional nutrition</span>
            <span className="dv2-venn-s">asks how much</span>
          </div>
          <div className="dv2-venn-mid">
            <Symbol size={64} />
            <span className="dv2-venn-t is-deepti">Deepti</span>
            <span className="dv2-venn-s">asks what’s for lunch</span>
          </div>
        </div>

        <div className="dv2-cols">
          <div data-sdp-reveal>
            <h3 className="dv2-col-h is-teal">Ayurvedic roots</h3>
            <ul className="dv2-rules">
              {AYURVEDA.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div data-sdp-reveal style={{ '--d': '.08s' } as React.CSSProperties}>
            <h3 className="dv2-col-h">Functional nutrition</h3>
            <ul className="dv2-rules">
              {FUNCTIONAL.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dv2-overlap" data-sdp-reveal>
          <p className="dv2-overlap-k">Deepti</p>
          <p>Reads both. Writes one plan. Checks it’s working, every week.</p>
        </div>
      </div>
    </section>
  );
}
