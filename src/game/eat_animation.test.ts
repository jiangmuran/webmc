import { describe, it, expect } from 'vitest';
import { cancelEating, eatProgress, makeEatState, startEating, tickEating } from './eat_animation';

describe('eat animation', () => {
  it('idle state', () => {
    const s = makeEatState();
    expect(s.itemId).toBeNull();
  });

  it('start sets item', () => {
    const s = makeEatState();
    expect(startEating(s, { itemId: 'webmc:apple' })).toBe(true);
    expect(s.itemId).toBe('webmc:apple');
  });

  it('second start refused', () => {
    const s = makeEatState();
    startEating(s, { itemId: 'webmc:apple' });
    expect(startEating(s, { itemId: 'webmc:bread' })).toBe(false);
  });

  it('tick decrements + emits particles', () => {
    const s = makeEatState();
    startEating(s, { itemId: 'webmc:apple' });
    let totalParticles = 0;
    for (let i = 0; i < 32; i++) {
      const r = tickEating(s);
      totalParticles += r.particlesSpawnedThisTick;
    }
    expect(totalParticles).toBe(8);
  });

  it('completes and consumes item', () => {
    const s = makeEatState();
    startEating(s, { itemId: 'webmc:apple' });
    let consumed: string | null = null;
    for (let i = 0; i < 40; i++) {
      const r = tickEating(s);
      if (r.completed) consumed = r.itemConsumed;
    }
    expect(consumed).toBe('webmc:apple');
  });

  it('cancel stops', () => {
    const s = makeEatState();
    startEating(s, { itemId: 'webmc:apple' });
    expect(cancelEating(s)).toBe(true);
    expect(s.itemId).toBeNull();
  });

  it('progress goes 0 → 1', () => {
    const s = makeEatState();
    startEating(s, { itemId: 'webmc:apple' });
    expect(eatProgress(s)).toBe(0);
    for (let i = 0; i < 16; i++) tickEating(s);
    expect(eatProgress(s)).toBeCloseTo(0.5);
  });

  it('custom eatTicks honored', () => {
    const s = makeEatState();
    startEating(s, { itemId: 'webmc:dried_kelp', eatTicks: 16 });
    let completed = false;
    for (let i = 0; i < 16; i++) {
      const r = tickEating(s);
      if (r.completed) completed = true;
    }
    expect(completed).toBe(true);
  });
});
