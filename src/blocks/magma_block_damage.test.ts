import { describe, it, expect } from 'vitest';
import {
  burnsPlayer,
  damageThisTick,
  producesBubbleColumn,
  MAGMA_LIGHT,
  DAMAGE_INTERVAL_TICKS,
  DAMAGE_PER_INTERVAL,
} from './magma_block_damage';

describe('magma block', () => {
  it('burns when standing', () => {
    expect(
      burnsPlayer({
        standingOnMagma: true,
        sneaking: false,
        wearsBoots: false,
        frostWalkerLevel: 0,
      }),
    ).toBe(true);
  });

  it('sneak prevents', () => {
    expect(
      burnsPlayer({
        standingOnMagma: true,
        sneaking: true,
        wearsBoots: false,
        frostWalkerLevel: 0,
      }),
    ).toBe(false);
  });

  it('frost walker prevents', () => {
    expect(
      burnsPlayer({
        standingOnMagma: true,
        sneaking: false,
        wearsBoots: true,
        frostWalkerLevel: 1,
      }),
    ).toBe(false);
  });

  it('damage periodic', () => {
    const q = { standingOnMagma: true, sneaking: false, wearsBoots: false, frostWalkerLevel: 0 };
    expect(damageThisTick(0, q)).toBe(DAMAGE_PER_INTERVAL);
    expect(damageThisTick(1, q)).toBe(0);
    expect(damageThisTick(DAMAGE_INTERVAL_TICKS, q)).toBe(DAMAGE_PER_INTERVAL);
  });

  it('bubble column underwater', () => {
    expect(producesBubbleColumn(true)).toBe('downward');
    expect(producesBubbleColumn(false)).toBeNull();
  });

  it('light emission', () => {
    expect(MAGMA_LIGHT).toBeGreaterThan(0);
  });
});
