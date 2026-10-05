import { site } from '@/lib/site';

export function Cta() {
  return (
    <div className="v3-cta-wrap">
      <a className="v3-cta" href={site.registerUrl} data-cta>
        Yes! I Want My Personalised Health Transformation Plan
      </a>
    </div>
  );
}
