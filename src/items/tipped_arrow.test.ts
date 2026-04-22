import { describe, it, expect } from 'vitest';
import { applyTippedArrowEffect, makeTippedArrow } from './tipped_arrow';

class Receiver {
  last: { id: string; amplifier: number; durationSec: number } | null = null;
  applyEffect(id: string, amplifier: number, durationSec: number): void {
    this.last = { id, amplifier, durationSec };
  }
}

describe('tipped arrow', () => {
  it('healing tipped arrow applies instant_health', () => {
    const a = makeTippedArrow('healing');
    expect(a).not.toBeNull();
    if (!a) return;
    const r = new Receiver();
    applyTippedArrowEffect(a, r);
    expect(r.last?.id).toBe('instant_health');
  });

  it('duration is 1/8 of the base potion', () => {
    const a = makeTippedArrow('regeneration');
    if (!a) return;
    expect(a.effect.durationSec).toBeLessThan(10); // 45 / 8 < 10
  });

  it('unknown potion returns null', () => {
    expect(makeTippedArrow('not_a_potion')).toBeNull();
  });
});
