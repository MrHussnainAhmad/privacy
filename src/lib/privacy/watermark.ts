import type { CSSProperties } from "react";

function slugSeed(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Single CSS-layer watermark — no extra DOM nodes or image requests beyond the header logo. */
export function getWatermarkStyle(slug: string, logoUrl: string): CSSProperties {
  const seed = slugSeed(slug);
  return {
    backgroundImage: `url("${logoUrl}")`,
    backgroundSize: `${92 + (seed % 36)}px`,
    backgroundRepeat: "repeat",
    backgroundPosition: `${seed % 72}px ${(seed >> 4) % 72}px`,
    transform: `rotate(${(seed % 18) - 9}deg)`,
    opacity: 0.028 + (seed % 4) * 0.006,
  };
}
