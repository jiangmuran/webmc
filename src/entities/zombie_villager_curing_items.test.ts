import { describe, it, expect } from 'vitest';
import {
  makeCureState,
  tryStartCure,
  applySpeedup,
  tickCure,
  BASE_CURE_TICKS,
} from './zombie_villager_curing_items';

describe('zombie cure', () => {
  it('needs both weakness + apple', () => {
    const s = makeCureState();
    expect(tryStartCure(s, { hasWeaknessEffect: true, usedGoldenApple: false })).toBe(false);
    expect(tryStartCure(s, { hasWeaknessEffect: true, usedGoldenApple: true })).toBe(true);
  });

  it('already in progress blocks', () => {
    const s = makeCureState();
    tryStartCure(s, { hasWeaknessEffect: true, usedGoldenApple: true });
    expect(tryStartCure(s, { hasWeaknessEffect: true, usedGoldenApple: true })).toBe(false);
  });

  it('speedup reduces time', () => {
    const s = makeCureState();
    tryStartCure(s, { hasWeaknessEffect: true, usedGoldenApple: true });
    applySpeedup(s, { ironBarsNearby: 4, bedsNearby: 4 });
    expect(s.speedBonus).toBeGreaterThan(0);
  });

  it('tick progresses', () => {
    const s = makeCureState();
    tryStartCure(s, { hasWeaknessEffect: true, usedGoldenApple: true });
    expect(tickCure(s, 100)).toBe('progress');
  });

  it('completes', () => {
    const s = makeCureState();
    tryStartCure(s, { hasWeaknessEffect: true, usedGoldenApple: true });
    expect(tickCure(s, BASE_CURE_TICKS)).toBe('cured');
  });

  it('idle if not in progress', () => {
    expect(tickCure(makeCureState(), 100)).toBe('idle');
  });
});
