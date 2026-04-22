// Spectral arrow. Applies Glowing effect for 10s when it hits an entity
// so teammates can see them through walls. Crafted from 4 glowstone dust
// + 1 arrow. Drops as arrow only (spectral variant is consumed on hit).

export const SPECTRAL_GLOW_DURATION_SEC = 10;

export interface SpectralArrowCraftQuery {
  arrows: number;
  glowstoneDust: number;
}

export function craftSpectralArrows(
  q: SpectralArrowCraftQuery,
): { item: 'webmc:spectral_arrow'; count: number } | null {
  if (q.arrows < 1 || q.glowstoneDust < 4) return null;
  return { item: 'webmc:spectral_arrow', count: 2 };
}

export interface SpectralHitResult {
  applyGlow: boolean;
  glowDurationSec: number;
  pickupKind: 'none' | 'arrow';
}

// On-hit behavior: entity gains Glowing; spectral arrow is consumed
// (no pickup). Creative-fired spectral arrows are never pickupable.
export function spectralArrowOnHit(fromCreative: boolean): SpectralHitResult {
  return {
    applyGlow: true,
    glowDurationSec: SPECTRAL_GLOW_DURATION_SEC,
    pickupKind: fromCreative ? 'none' : 'none',
  };
}

// Arrow miss (lands on block): regular arrow pickup if shot in survival;
// creative arrows cannot be picked up.
export function spectralArrowOnBlockHit(fromCreative: boolean): 'arrow' | 'none' {
  return fromCreative ? 'none' : 'arrow';
}
