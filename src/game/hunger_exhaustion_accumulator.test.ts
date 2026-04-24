import { describe, it, expect } from 'vitest';
import {
  accumulate,
  regen,
  EXHAUSTION_THRESHOLD,
  EXHAUSTION_COSTS,
  type HungerState,
} from './hunger_exhaustion_accumulator';

const full: HungerState = { food: 20, saturation: 5, exhaustion: 0 };

describe('hunger exhaustion accumulator', () => {
  it('below threshold only accumulates', () => {
    const s = accumulate(full, 1);
    expect(s.exhaustion).toBe(1);
    expect(s.food).toBe(20);
  });

  it('crossing threshold drains saturation', () => {
    const s = accumulate(full, EXHAUSTION_THRESHOLD);
    expect(s.saturation).toBe(4);
    expect(s.food).toBe(20);
  });

  it('empty saturation drains food', () => {
    const s = accumulate({ food: 20, saturation: 0, exhaustion: 0 }, EXHAUSTION_THRESHOLD);
    expect(s.food).toBe(19);
  });

  it('food floor 0', () => {
    const s = accumulate({ food: 0, saturation: 0, exhaustion: 0 }, EXHAUSTION_THRESHOLD * 5);
    expect(s.food).toBe(0);
  });

  it('regen when full food', () => {
    expect(regen(full).saturation).toBeLessThan(full.saturation);
  });

  it('no regen when hungry', () => {
    const hungry: HungerState = { food: 10, saturation: 0, exhaustion: 0 };
    expect(regen(hungry)).toEqual(hungry);
  });

  it('costs are positive', () => {
    expect(EXHAUSTION_COSTS.attack).toBeGreaterThan(0);
  });
});
