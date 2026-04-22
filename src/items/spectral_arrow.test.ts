import { describe, it, expect } from 'vitest';
import {
  craftSpectralArrows,
  SPECTRAL_GLOW_DURATION_SEC,
  spectralArrowOnBlockHit,
  spectralArrowOnHit,
} from './spectral_arrow';

describe('spectral arrow', () => {
  it('crafts with 1 arrow + 4 dust', () => {
    expect(craftSpectralArrows({ arrows: 1, glowstoneDust: 4 })).not.toBeNull();
  });

  it('refuses with insufficient dust', () => {
    expect(craftSpectralArrows({ arrows: 1, glowstoneDust: 3 })).toBeNull();
  });

  it('applies 10s glow on hit', () => {
    const r = spectralArrowOnHit(false);
    expect(r.applyGlow).toBe(true);
    expect(r.glowDurationSec).toBe(SPECTRAL_GLOW_DURATION_SEC);
  });

  it('block hit drops arrow in survival', () => {
    expect(spectralArrowOnBlockHit(false)).toBe('arrow');
  });

  it('creative arrow has no pickup', () => {
    expect(spectralArrowOnBlockHit(true)).toBe('none');
  });
});
