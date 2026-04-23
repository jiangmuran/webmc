import { describe, it, expect } from 'vitest';
import { fractionInLevel, addXp } from './experience_bar_segments';

describe('experience bar segments', () => {
  it('half in level', () => {
    const b = { level: 0, progressInLevel: 3.5 };
    expect(fractionInLevel(b)).toBeCloseTo(0.5, 1);
  });

  it('add levels up', () => {
    const b = addXp({ level: 0, progressInLevel: 0 }, 1000);
    expect(b.level).toBeGreaterThan(0);
  });

  it('small add stays in level', () => {
    const b = addXp({ level: 0, progressInLevel: 0 }, 2);
    expect(b.level).toBe(0);
    expect(b.progressInLevel).toBe(2);
  });
});
