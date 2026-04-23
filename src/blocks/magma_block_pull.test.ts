import { describe, it, expect } from 'vitest';
import { createsDownwardBubble, damagesOnStep, fallDamageNegated } from './magma_block_pull';

describe('magma block pull', () => {
  it('creates bubble when water above', () => {
    expect(createsDownwardBubble({ waterAbove: true, entityOnTop: false, sneaking: false })).toBe(
      true,
    );
  });

  it('no water no bubble', () => {
    expect(createsDownwardBubble({ waterAbove: false, entityOnTop: false, sneaking: false })).toBe(
      false,
    );
  });

  it('damages standing', () => {
    expect(damagesOnStep({ waterAbove: false, entityOnTop: true, sneaking: false })).toBe(true);
  });

  it('sneak safe', () => {
    expect(damagesOnStep({ waterAbove: false, entityOnTop: true, sneaking: true })).toBe(false);
  });

  it('fall damage normal', () => {
    expect(fallDamageNegated()).toBe(false);
  });
});
