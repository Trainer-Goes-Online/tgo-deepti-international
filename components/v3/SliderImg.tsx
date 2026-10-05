import { asset } from '@/components/shared/asset-version';
import { PROOF_DIMS } from '@/lib/proof-dims';

/* A row image with its real size declared, so the tile keeps its width while it loads
   and the sliding row never jumps. */
export function SliderImg({ dir, file, className }: { dir: string; file: string; className: string }) {
  const [w, h] = PROOF_DIMS[`${dir}/${file}`] ?? [3, 4];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={asset(`/${dir}/${encodeURIComponent(file)}`)}
      alt=""
      width={w}
      height={h}
      style={{ aspectRatio: `${w} / ${h}` }}
      loading="lazy"
      decoding="async"
    />
  );
}
