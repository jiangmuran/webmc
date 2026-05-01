import { describe, it, expect } from 'vitest';
import { canPlace, tryGrow, drops, boneMealGrow, MAX_AGE } from './cocoa_grow';

describe('cocoa', () => {
  it('place on jungle log side', () => {
    expect(canPlace({ sideBlockId: 'webmc:jungle_log', sideIsLogSide: true })).toBe(true);
    expect(canPlace({ sideBlockId: 'webmc:oak_log', sideIsLogSide: true })).toBe(false);
  });

  it('grow on low roll', () => {
    const c = { age: 0, facing: 'north' as const };
    expect(tryGrow(c, () => 0.1)).toBe(true);
    expect(c.age).toBe(1);
  });

  it('capped at max', () => {
    const c = { age: MAX_AGE, facing: 'north' as const };
    expect(tryGrow(c, () => 0)).toBe(false);
  });

  it('mature pod always drops exactly 3 beans (wiki: Fortune does not affect)', () => {
    const c = { age: MAX_AGE, facing: 'north' as const };
    expect(drops(c, 0, () => 0)).toBe(3);
    expect(drops(c, 0, () => 0.99)).toBe(3);
    expect(drops(c, 3, () => 0)).toBe(3);
    expect(drops(c, 3, () => 0.99)).toBe(3);
  });

  it('immature drops 1', () => {
    const c = { age: 0, facing: 'north' as const };
    expect(drops(c, 0, () => 0)).toBe(1);
  });

  it('bone meal advances', () => {
    const c = { age: 0, facing: 'north' as const };
    expect(boneMealGrow(c)).toBe(true);
    expect(c.age).toBe(1);
  });
});
