/* An auto-scrolling row: the set renders twice and slides by -50%; the copy is inert. */
export function Rail({
  children,
  dir = 'ltr',
  className = '',
}: {
  children: (copy: number) => React.ReactNode;
  dir?: 'ltr' | 'rtl';
  className?: string;
}) {
  return (
    <div className={`v3-rail is-${dir} ${className}`}>
      <div className="v3-rail-track">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="v3-rail-set"
            {...(copy === 1 ? { inert: true, 'aria-hidden': true } : {})}
          >
            {children(copy)}
          </div>
        ))}
      </div>
    </div>
  );
}
