import { describe, it, expect } from 'vitest';
import {
  makeAnger,
  provoke,
  isHostile,
  shouldShareAnger,
  ANGER_MIN_MS,
  ANGER_MAX_MS,
} from './zombified_piglin_aggro';

describe('zombified piglin anger', () => {
  it('neutral by default', () => {
    const z = makeAnger();
    expect(isHostile(z, 'p', 100)).toBe(false);
  });

  it('provoke makes hostile', () => {
    const z = makeAnger();
    provoke(z, 'p', 0, () => 0);
    expect(isHostile(z, 'p', 100)).toBe(true);
  });

  it('anger cools down', () => {
    const z = makeAnger();
    provoke(z, 'p', 0, () => 1);
    expect(isHostile(z, 'p', ANGER_MAX_MS - 1)).toBe(true);
    expect(isHostile(z, 'p', ANGER_MAX_MS + 1)).toBe(false);
  });

  it('other players safe', () => {
    const z = makeAnger();
    provoke(z, 'p1', 0, () => 0);
    expect(isHostile(z, 'p2', 100)).toBe(false);
  });

  it('anger within min range', () => {
    const z = makeAnger();
    provoke(z, 'p', 0, () => 0);
    expect(isHostile(z, 'p', ANGER_MIN_MS - 1)).toBe(true);
  });

  it('share near, not far', () => {
    expect(
      shouldShareAnger({ mobPos: { x: 10, y: 0, z: 0 }, provokedPos: { x: 0, y: 0, z: 0 } }),
    ).toBe(true);
    expect(
      shouldShareAnger({ mobPos: { x: 100, y: 0, z: 0 }, provokedPos: { x: 0, y: 0, z: 0 } }),
    ).toBe(false);
  });
});
