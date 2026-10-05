import { asset } from '@/components/shared/asset-version';
import { WA_ROW_1, WA_ROW_2 } from '@/lib/proof-data';
import { Rail } from './Rail';

export function Wins() {
  return (
    <section className="v3-section v3-wins">
      <div className="v3-wrap v3-narrow">
        <h2 className="v3-h2" data-sdp-reveal>
          Hundreds Of Health Journeys. <br className="v3-br" />
          Countless Wins Along The Way.
        </h2>
        <p className="v3-sub" data-sdp-reveal>
          Here&apos;s a small glimpse into our clients&apos; journeys.
        </p>
      </div>

      {[WA_ROW_1, WA_ROW_2].map((row, r) => (
        <Rail dir={r === 0 ? 'ltr' : 'rtl'} className="is-wa" key={r}>
          {(copy) =>
            row.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${copy}-${src}`}
                className="v3-wa"
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
  );
}
