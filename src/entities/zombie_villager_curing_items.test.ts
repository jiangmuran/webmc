import { describe, it, expect } from 'vitest';
import {
  makeCureState,
  tryStartCure,
  applySpeedup,
  tickCure,
  BASE_CURE_TICKS,
  BASE_CURE_MIN_TICKS,
  BASE_CURE_MAX_TICKS,
  MAX_SPEEDUP,
  ACCELERANT_CAP,
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

  it('default duration is midpoint 4800 (wiki: random 3600-6000)', () => {
    const s = makeCureState();
    tryStartCure(s, { hasWeaknessEffect: true, usedGoldenApple: true });
    expect(s.timeRemainingTicks).toBe(BASE_CURE_TICKS);
  });

  it('rng → random duration in [3600, 6000] (wiki)', () => {
    const lo = makeCureState();
    tryStartCure(lo, { hasWeaknessEffect: true, usedGoldenApple: true, rng: () => 0 });
    expect(lo.timeRemainingTicks).toBe(BASE_CURE_MIN_TICKS);

    const hi = makeCureState();
    tryStartCure(hi, { hasWeaknessEffect: true, usedGoldenApple: true, rng: () => 0.99999 });
    expect(hi.timeRemainingTicks).toBe(BASE_CURE_MAX_TICKS);
  });

  it('speedup max 4.2% at 14 accelerants (wiki)', () => {
    const s = makeCureState();
    tryStartCure(s, { hasWeaknessEffect: true, usedGoldenApple: true });
    applySpeedup(s, { ironBarsNearby: 7, bedsNearby: 7 });
    expect(s.speedBonus).toBeCloseTo(MAX_SPEEDUP, 5);
  });

  it('speedup beyond 14 accelerants does not stack (wiki: capped)', () => {
    const s = makeCureState();
    tryStartCure(s, { hasWeaknessEffect: true, usedGoldenApple: true });
    applySpeedup(s, { ironBarsNearby: 100, bedsNearby: 100 });
    expect(s.speedBonus).toBeCloseTo(ACCELERANT_CAP * 0.003, 5);
  });

  it('tick progresses', () => {
    const s = makeCureState();
    tryStartCure(s, { hasWeaknessEffect: true, usedGoldenApple: true });
    expect(tickCure(s, 100)).toBe('progress');
  });

  it('completes after midpoint duration with no accelerants', () => {
    const s = makeCureState();
    tryStartCure(s, { hasWeaknessEffect: true, usedGoldenApple: true });
    expect(tickCure(s, BASE_CURE_TICKS)).toBe('cured');
  });

  it('idle if not in progress', () => {
    expect(tickCure(makeCureState(), 100)).toBe('idle');
  });
});
