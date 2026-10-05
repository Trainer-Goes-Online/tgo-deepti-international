import { Symbol } from '@/components/v2/Brand';

/* The brand's reversed lockup on a teal bar. The name stays in Marcellus per the logo rules. */
export function TopBar() {
  return (
    <header className="v3-topbar">
      <span className="v3-brand">
        <Symbol size={40} variant="reversed" />
        <span className="v3-brand-rule" aria-hidden />
        <span className="v3-wordmark">Deepti Sherawat</span>
      </span>
    </header>
  );
}
