import { describe, it, expect } from 'vitest';
import { actionExhaustion, applyExhaustion } from './hunger_exhaustion';

describe('hunger exhaustion', () => {
  it('sprinting 10 blocks = 1.0', () => {
    expect(actionExhaustion({ kind: 'sprint', blocks: 10 })).toBeCloseTo(1.0);
  });

  it('walking is free', () => {
    expect(actionExhaustion({ kind: 'walk', blocks: 10 })).toBe(0);
  });

  it('heal tick scales with HP', () => {
    expect(actionExhaustion({ kind: 'heal_tick', hpRestored: 2 })).toBe(12);
  });

  it('exhaustion drains saturation first', () => {
    const s = { exhaustion: 0, saturation: 5, hunger: 10 };
    applyExhaustion(s, { kind: 'sprint', blocks: 50 });
    expect(s.saturation).toBeLessThan(5);
    expect(s.hunger).toBe(10);
  });

  it('exhaustion drains hunger when saturation zero', () => {
    const s = { exhaustion: 0, saturation: 0, hunger: 10 };
    applyExhaustion(s, { kind: 'heal_tick', hpRestored: 5 });
    expect(s.hunger).toBeLessThan(10);
  });

  it('exhaustion wraps correctly', () => {
    const s = { exhaustion: 3, saturation: 0, hunger: 20 };
    const r = applyExhaustion(s, { kind: 'heal_tick', hpRestored: 1 });
    expect(r.hungerSpent).toBeGreaterThan(0);
  });
});
