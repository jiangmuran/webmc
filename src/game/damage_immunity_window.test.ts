import { describe, it, expect } from 'vitest';
import { isImmune, canTakeNewHit, DEFAULT_IMMUNE_TICKS } from './damage_immunity_window';

describe('damage immunity window', () => {
  it('fresh hit immune', () => {
    expect(isImmune({ lastHitTick: 0, currentTick: 5 })).toBe(true);
  });

  it('expired no longer', () => {
    expect(isImmune({ lastHitTick: 0, currentTick: DEFAULT_IMMUNE_TICKS })).toBe(false);
  });

  it('can take new hit after window', () => {
    expect(canTakeNewHit({ lastHitTick: 0, currentTick: 100 })).toBe(true);
  });
});
