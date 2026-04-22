import { describe, it, expect } from 'vitest';
import {
  frogVariantForTemp,
  tickTadpole,
  froglightFor,
  TADPOLE_MATURE_TICKS,
} from './frog_variant';

describe('frog', () => {
  it('variant by temperature', () => {
    expect(frogVariantForTemp(0.1)).toBe('cold');
    expect(frogVariantForTemp(0.8)).toBe('temperate');
    expect(frogVariantForTemp(2.0)).toBe('warm');
  });

  it('tadpole matures', () => {
    const t = { ageTicks: TADPOLE_MATURE_TICKS - 1 };
    expect(tickTadpole(t)).toBe(true);
  });

  it('magma cube → pearlescent', () => {
    expect(froglightFor('cold', 'magma_cube')).toBe('webmc:pearlescent_froglight');
    expect(froglightFor('warm', 'slime')).toBe('webmc:ochre_froglight');
    expect(froglightFor('temperate', 'strider')).toBe('webmc:verdant_froglight');
  });
});
