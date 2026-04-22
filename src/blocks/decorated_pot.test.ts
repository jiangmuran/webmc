import { describe, it, expect } from 'vitest';
import { hasSherd, insertIntoPot, makeDecoratedPot, takeFromPot } from './decorated_pot';

describe('decorated pot', () => {
  it('all 4 faces default to blank', () => {
    const p = makeDecoratedPot();
    expect(p.faces.north).toBe('blank');
    expect(p.faces.south).toBe('blank');
  });

  it('hasSherd finds the chosen face', () => {
    const p = makeDecoratedPot({ north: 'heart_pottery_sherd' });
    expect(hasSherd(p, 'heart_pottery_sherd')).toBe(true);
    expect(hasSherd(p, 'archer_pottery_sherd')).toBe(false);
  });

  it('insert + take stores a single stack', () => {
    const p = makeDecoratedPot();
    const rem = insertIntoPot(p, { itemId: 5, count: 3, damage: 0 });
    expect(rem).toBeNull();
    const out = takeFromPot(p);
    expect(out?.count).toBe(3);
  });

  it('merges into existing matching stack', () => {
    const p = makeDecoratedPot();
    insertIntoPot(p, { itemId: 5, count: 3, damage: 0 });
    insertIntoPot(p, { itemId: 5, count: 7, damage: 0 });
    expect(p.contents?.count).toBe(10);
  });

  it('refuses to merge different item', () => {
    const p = makeDecoratedPot();
    insertIntoPot(p, { itemId: 5, count: 3, damage: 0 });
    const rem = insertIntoPot(p, { itemId: 99, count: 1, damage: 0 });
    expect(rem?.itemId).toBe(99);
    expect(p.contents?.itemId).toBe(5);
  });
});
