import { describe, it, expect } from 'vitest';
import {
  addPetal,
  boneMealLeavesDrop,
  breakPetalCarpet,
  makePetalCarpet,
  planCherryTree,
} from './cherry_grove';

describe('cherry grove', () => {
  it('tree has reasonable trunk height', () => {
    const t = planCherryTree({ rng: () => 0.5 });
    expect(t.trunkHeight).toBeGreaterThanOrEqual(5);
    expect(t.trunkHeight).toBeLessThanOrEqual(8);
  });

  it('occasional beehive', () => {
    const t = planCherryTree({ rng: () => 0.01 });
    expect(t.hasBeehive).toBe(true);
  });

  it('petal carpet starts at 1', () => {
    expect(makePetalCarpet().count).toBe(1);
  });

  it('addPetal stacks up to 4', () => {
    const c = makePetalCarpet();
    for (let i = 0; i < 5; i++) addPetal(c);
    expect(c.count).toBe(4);
  });

  it('break drops n petals', () => {
    const c = makePetalCarpet(3);
    expect(breakPetalCarpet(c).count).toBe(3);
  });

  it('bone meal occasionally drops sapling', () => {
    expect(boneMealLeavesDrop(0.01)).toBe('webmc:cherry_sapling');
    expect(boneMealLeavesDrop(0.9)).toBeNull();
  });
});
