import { describe, it, expect } from 'vitest';
import { runCarver, shouldBranch } from './cave_carver_direction';

describe('cave carver', () => {
  it('produces maxLength steps', () => {
    const steps = runCarver({
      rand: () => 0.5,
      startX: 0,
      startY: 30,
      startZ: 0,
      maxLength: 64,
    });
    expect(steps.length).toBe(64);
  });

  it('radius within expected', () => {
    const steps = runCarver({
      rand: () => 0.5,
      startX: 0,
      startY: 30,
      startZ: 0,
      maxLength: 10,
    });
    for (const s of steps) {
      expect(s.radius).toBeGreaterThanOrEqual(2);
      expect(s.radius).toBeLessThanOrEqual(4);
    }
  });

  it('deterministic for same rand', () => {
    const a = runCarver({
      rand: () => 0.3,
      startX: 0,
      startY: 30,
      startZ: 0,
      maxLength: 20,
    });
    const b = runCarver({
      rand: () => 0.3,
      startX: 0,
      startY: 30,
      startZ: 0,
      maxLength: 20,
    });
    expect(a).toEqual(b);
  });

  it('branch chance', () => {
    expect(shouldBranch(() => 0)).toBe(true);
    expect(shouldBranch(() => 0.99)).toBe(false);
  });
});
