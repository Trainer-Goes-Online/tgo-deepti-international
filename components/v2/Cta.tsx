import { site } from '@/lib/site';
import { ArrowRight } from './Brand';

export function Cta({ tone = 'teal' }: { tone?: 'teal' | 'turmeric' }) {
  return (
    <a className={`dv2-cta is-${tone}`} href={site.registerUrl} data-cta>
      Book my Clarity Call
      <ArrowRight />
    </a>
  );
}
