import { describe, it, expect } from 'vitest';
import {
  applyWeakness,
  feedGoldenApple,
  makeCureState,
  planIgloo,
  tickCure,
  ZOMBIE_VILLAGER_CURE_SEC,
} from './igloo';

describe('igloo', () => {
  it('basement generated when roll < 0.5', () => {
    const i = planIgloo({ basementRoll: 0.1 });
    expect(i.hasBasement).toBe(true);
    expect(i.hasGoldenApple).toBe(true);
    expect(i.hasPotionOfWeakness).toBe(true);
  });

  it('no basement when roll >= 0.5', () => {
    const i = planIgloo({ basementRoll: 0.9 });
    expect(i.hasBasement).toBe(false);
    expect(i.basementDepth).toBe(0);
  });
});

describe('zombie villager cure', () => {
  it('feeding golden apple alone does nothing', () => {
    const s = makeCureState();
    expect(feedGoldenApple(s)).toBe(false);
  });

  it('weakness + golden apple + time = cured', () => {
    const s = makeCureState();
    applyWeakness(s);
    feedGoldenApple(s);
    expect(tickCure(s, ZOMBIE_VILLAGER_CURE_SEC)).toBe(true);
    expect(s.cured).toBe(true);
  });

  it('cure not complete before timer expires', () => {
    const s = makeCureState();
    applyWeakness(s);
    feedGoldenApple(s);
    expect(tickCure(s, 30)).toBe(false);
  });

  it('does not tick without required steps', () => {
    const s = makeCureState();
    expect(tickCure(s, 1000)).toBe(false);
  });
});
