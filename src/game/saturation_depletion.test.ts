import { describe, it, expect } from 'vitest';
import { tick, eat, regenAllowed, regenTick } from './saturation_depletion';

describe('saturation depletion', () => {
  it('low exhaustion no drop', () => {
    const r = tick({ food: 20, saturation: 5, exhaustion: 2 });
    expect(r.saturation).toBe(5);
  });

  it('high exhaustion depletes saturation', () => {
    const r = tick({ food: 20, saturation: 5, exhaustion: 4 });
    expect(r.saturation).toBe(4);
    expect(r.exhaustion).toBe(0);
  });

  it('zero saturation depletes food', () => {
    const r = tick({ food: 20, saturation: 0, exhaustion: 4 });
    expect(r.food).toBe(19);
  });

  it('eat respects cap', () => {
    const r = eat({ food: 18, saturation: 18, exhaustion: 0 }, 5, 3);
    expect(r.food).toBe(20);
    expect(r.saturation).toBe(20);
  });

  it('regen requires ≥18 food', () => {
    expect(regenAllowed({ food: 18, saturation: 0, exhaustion: 0 })).toBe(true);
    expect(regenAllowed({ food: 17, saturation: 0, exhaustion: 0 })).toBe(false);
  });

  it('regen adds exhaustion', () => {
    const r = regenTick({ food: 20, saturation: 0, exhaustion: 0 });
    expect(r.exhaustion).toBeGreaterThan(0);
  });
});
