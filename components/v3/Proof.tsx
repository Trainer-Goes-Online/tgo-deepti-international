import { asset } from '@/components/shared/asset-version';
import { Star } from '@/components/v2/Brand';
import { BEFORE_AFTER, CASE_STUDIES, TESTIMONIALS } from '@/lib/proof-data';
import { Cta } from './Cta';
import { Rail } from './Rail';
import { SliderImg } from './SliderImg';

/* Lab report images go in /public/reports and are listed here; the row stays hidden while empty. */
const REPORTS: string[] = [];

const DURATION = / DURATION$/;

function VideoStack({ items }: { items: typeof TESTIMONIALS }) {
  return (
    <div className="v3-vstack">
      {items.map((t) => (
        <div className="v3-vt" key={t.vimeoId} data-sdp-reveal>
          <iframe
            src={`https://player.vimeo.com/video/${t.vimeoId}?title=0&byline=0&portrait=0`}
            title={`${t.name}'s testimonial`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

export function Proof() {
  return (
    <section className="v3-section v3-proof">
      <div className="v3-wrap v3-narrow">
        <p className="v3-eyebrow" data-sdp-reveal>
          PROGRESS YOU CAN SEE. CHANGES YOU CAN MEASURE.
        </p>
        <h2 className="v3-h2" data-sdp-reveal>
          Better Liver Health. Healthier Weight. <br className="v3-br" />
          Stronger Metabolic Markers.
        </h2>
        <p className="v3-sub" data-sdp-reveal>
          See how clients made progress across multiple areas of health through Deepti’s
          personalised Ayurveda + functional nutrition approach.
        </p>
      </div>

      <VideoStack items={TESTIMONIALS.slice(0, 7)} />

      <Rail dir="ltr" className="is-shots">
        {(copy) =>
          BEFORE_AFTER.map((src) => (
            <SliderImg key={`${copy}-${src}`} dir="before-after" file={src} className="v3-shot" />
          ))
        }
      </Rail>

      <VideoStack items={TESTIMONIALS.slice(7)} />

      <Rail dir="rtl" className="is-cases">
        {(copy) =>
          CASE_STUDIES.map((c) => {
            const duration = c.stats.find((s) => DURATION.test(s));
            const chips = c.stats.filter((s) => s !== duration);
            return (
              <article className="v3-case" key={`${copy}-${c.name}`}>
                <header className="v3-case-head">
                  <h3>
                    {c.name}, {c.age}
                  </h3>
                  <span className="v3-stars" aria-label="Rated 5 out of 5">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} size={16} />
                    ))}
                  </span>
                </header>
                <p className="v3-case-body">{c.body}</p>
                <ul className="v3-chips">
                  {chips.map((s) => (
                    <li key={s}>
                      {s.split('→').map((part, i) => (
                        <span key={i}>
                          {i > 0 && <i className="v3-arrow">→</i>}
                          {part}
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
                {duration && (
                  <p className="v3-case-foot">{duration.replace(DURATION, '').toLowerCase()}</p>
                )}
              </article>
            );
          })
        }
      </Rail>

      {REPORTS.length > 0 && (
        <Rail dir="ltr" className="is-shots">
          {(copy) =>
            REPORTS.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${copy}-${src}`}
                className="v3-shot"
                src={asset(`/reports/${encodeURIComponent(src)}`)}
                alt=""
                loading="lazy"
                decoding="async"
              />
            ))
          }
        </Rail>
      )}

      <Cta />
    </section>
  );
}
