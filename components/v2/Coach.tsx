import { asset } from '@/components/shared/asset-version';
import { site } from '@/lib/site';

const CREDENTIALS = [
  { k: '700+', v: 'client journeys' },
  { k: 'Top Nutritionist', v: 'Cult Fit' },
  { k: 'Advisory Board', v: 'AAFT School of Health & Wellness' },
  { k: 'Hormonal & Liver Detox', v: 'Habuild' },
];

export function Coach() {
  return (
    <section className="dv2-section dv2-coach">
      <div className="dv2-wrap dv2-coach-grid">
        <div className="dv2-coach-head">
          <p className="dv2-label" data-sdp-reveal>
            Meet your coach
          </p>
          <h2 className="dv2-h2" data-sdp-reveal>
            Former lawyer. <em>Current liver whisperer.</em>
          </h2>
        </div>

        <div className="dv2-coach-photo">
          <figure className="dv2-portrait" data-sdp-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/deepti.webp')} alt="Deepti Sherawat" width={800} height={1000} loading="lazy" decoding="async" />
          </figure>
          <p className="dv2-coach-name">Deepti Sherawat</p>
        </div>

        <div className="dv2-coach-body">
          <div className="dv2-prose" data-sdp-reveal>
            <p>
              Deepti Sherawat spent her early career in courtrooms. She walked away when practice
              asked for compromises she wouldn&apos;t make, and started again as an Ayurvedic
              nutritionist trained in functional nutrition.
            </p>
            <p>
              She still works like a lawyer: question everything, read the evidence, build the case.
              Only now the evidence is your blood report and the case is your health.
            </p>
            <p>
              Over {site.yearsInPractice} years and 700+ client journeys across India, the US,
              Canada, the UK, Australia and the Middle East, she has been named Top Nutritionist at
              Cult Fit, joined the Advisory Board of AAFT School of Health &amp; Wellness, and led the
              Hormonal &amp; Liver Detox programmes at Habuild.
            </p>
            <p>
              Today, Deepti and her qualified team guide clients worldwide. She shapes every plan and
              reviews every progress check herself.
            </p>
          </div>

          <ul className="dv2-creds">
            {CREDENTIALS.map((c) => (
              <li key={c.k} data-sdp-reveal>
                <span className="dv2-cred-k">{c.k}</span>
                <span className="dv2-cred-v">{c.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
