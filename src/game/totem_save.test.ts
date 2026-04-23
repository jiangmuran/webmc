import { describe, it, expect } from 'vitest';
import { onFatalHit, hpAfterSave } from './totem_save';

describe('totem save', () => {
  it('no totem no save', () => {
    const r = onFatalHit({ hasTotemMainHand: false, hasTotemOffHand: false });
    expect(r.saved).toBe(false);
  });

  it('offhand preferred', () => {
    const r = onFatalHit({ hasTotemMainHand: true, hasTotemOffHand: true });
    expect(r.consumedHand).toBe('off');
  });

  it('mainhand fallback', () => {
    const r = onFatalHit({ hasTotemMainHand: true, hasTotemOffHand: false });
    expect(r.consumedHand).toBe('main');
  });

  it('effects granted', () => {
    const r = onFatalHit({ hasTotemMainHand: true, hasTotemOffHand: false });
    expect(r.grantedEffects.find((e) => e.id === 'regeneration')).toBeDefined();
    expect(r.grantedEffects.find((e) => e.id === 'absorption')).toBeDefined();
  });

  it('hp left = 1', () => {
    expect(hpAfterSave()).toBe(1);
  });
});
