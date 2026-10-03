import { site } from '@/lib/site';
import { Symbol } from './Brand';

/* The brand's horizontal lockup: symbol, turmeric hairline, carved name, descriptor. */
export function Header() {
  return (
    <header className="dv2-header">
      <div className="dv2-wrap dv2-header-in">
        <span className="dv2-brand">
          <Symbol size={40} />
          <span className="dv2-brand-rule" aria-hidden />
          <span className="dv2-brand-text">
            <span className="dv2-wordmark">Deepti Sherawat</span>
            <span className="dv2-descriptor">Ayurvedic &amp; functional nutrition</span>
          </span>
        </span>
        <a className="dv2-header-cta" href={site.registerUrl} data-cta>
          Book a call
        </a>
      </div>
    </header>
  );
}
