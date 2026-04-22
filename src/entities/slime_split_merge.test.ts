import { describe, it, expect } from 'vitest';
import { splitOnDeath, damageDealt, attackRange } from './slime_split_merge';

describe('slime split merge', () => {
  it('tiny drops slimeballs, no children', () => {
    const r = splitOnDeath({ size: 1 }, () => 0.5);
    expect(r.children.length).toBe(0);
  });

  it('big splits to medium', () => {
    const r = splitOnDeath({ size: 4 }, () => 0);
    expect(r.children.length).toBeGreaterThanOrEqual(2);
    for (const c of r.children) expect(c.size).toBe(2);
  });

  it('medium splits to tiny', () => {
    const r = splitOnDeath({ size: 2 }, () => 0.99);
    for (const c of r.children) expect(c.size).toBe(1);
  });

  it('damage by size', () => {
    expect(damageDealt({ size: 1 })).toBe(0);
    expect(damageDealt({ size: 2 })).toBe(2);
    expect(damageDealt({ size: 4 })).toBe(4);
  });

  it('attack range scales', () => {
    expect(attackRange({ size: 4 })).toBe(2);
  });
});
