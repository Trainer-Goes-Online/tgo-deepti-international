import { asset } from '@/components/shared/asset-version';
import { BEFORE_AFTER, CASE_STUDIES, TESTIMONIALS, WA_ROW_1, WA_ROW_2 } from '@/lib/proof-data';
import { Prakara, Star } from './Brand';

const DURATION = / DURATION$/;

/* Each rail renders its set twice and slides by -50%; the copy is inert. */
function Rail({ children, kind }: { children: (copy: number) => React.ReactNode; kind: string }) {
  return (
    <div className={`dv2-rail is-${kind}`}>
      <div className="dv2-rail-track">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="dv2-rail-set"
            {...(copy === 1 ? { inert: true, 'aria-hidden': true } : {})}
          >
            {children(copy)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Results() {
  return (
    <>
      <section className="dv2-band dv2-results">
        <Prakara />
        <div className="dv2-wrap">
          <div className="dv2-narrow">
            <h2 className="dv2-h2 is-light" data-sdp-reveal>
              Progress you can see. <em>Numbers you can show your doctor.</em>
            </h2>
            <p className="dv2-sub is-light" data-sdp-reveal>
              Real clients, real reports, shared with their permission.
            </p>
          </div>
        </div>

        <Rail kind="cases">
          {(copy) =>
            CASE_STUDIES.map((c) => {
              const duration = c.stats.find((s) => DURATION.test(s));
              const chips = c.stats.filter((s) => s !== duration);
              return (
                <article className="dv2-case" key={`${copy}-${c.name}`}>
                  <header className="dv2-case-head">
                    <h3>
                      {c.name}, {c.age}
                    </h3>
                    <span className="dv2-stars" aria-label="Rated 5 out of 5">
                      {[0, 1, 2, 3, 4].map((s) => (
                        <Star key={s} />
                      ))}
                    </span>
                  </header>
                  <p className="dv2-case-body">{c.body}</p>
                  <ul className="dv2-chips">
                    {/* Split on the arrow only to colour it; the words stay as supplied. */}
                    {chips.map((s) => (
                      <li key={s}>
                        {s.split('→').map((part, i) => (
                          <span key={i}>
                            {i > 0 && <i className="dv2-arrow">→</i>}
                            {part}
                          </span>
                        ))}
                      </li>
                    ))}
                  </ul>
                  {duration && (
                    <p className="dv2-case-foot">{duration.replace(DURATION, '').toLowerCase()}</p>
                  )}
                </article>
              );
            })
          }
        </Rail>

        <div className="dv2-wrap">
          <p className="dv2-vary">Individual results vary.</p>
        </div>
      </section>

      <section className="dv2-section dv2-proofwall">
        <Rail kind="video">
          {(copy) =>
            TESTIMONIALS.map((t) => (
              <div className="dv2-vt" key={`${copy}-${t.vimeoId}`}>
                <iframe
                  src={`https://player.vimeo.com/video/${t.vimeoId}?title=0&byline=0&portrait=0`}
                  title={`${t.name}'s testimonial`}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
                <span className="dv2-vt-name">{t.name}</span>
              </div>
            ))
          }
        </Rail>

        <Rail kind="shots">
          {(copy) =>
            BEFORE_AFTER.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${copy}-${src}`}
                className="dv2-shot"
                src={asset(`/before-after/${encodeURIComponent(src)}`)}
                alt=""
                loading="lazy"
                decoding="async"
              />
            ))
          }
        </Rail>

        <div className="dv2-wrap dv2-narrow dv2-wins-head">
          <h2 className="dv2-h2" data-sdp-reveal>
            The little wins. <em>(They’re not little.)</em>
          </h2>
          <p className="dv2-sub" data-sdp-reveal>
            A peek at the messages that make our day.
          </p>
        </div>

        {[WA_ROW_1, WA_ROW_2].map((row, r) => (
          <Rail kind={r === 0 ? 'wa' : 'wa is-rev'} key={r}>
            {(copy) =>
              row.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${copy}-${src}`}
                  className="dv2-wa"
                  src={asset(`/testimonials/${encodeURIComponent(src)}`)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              ))
            }
          </Rail>
        ))}
      </section>
    </>
  );
}
