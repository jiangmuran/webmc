import { describe, it, expect } from 'vitest';
import {
  fire,
  consumesOneArrow,
  incompatibleWith,
  MULTISHOT_EXTRA_ARROW_SPREAD_DEG,
} from './multishot_crossbow';

describe('multishot crossbow', () => {
  it('single arrow without enchant', () => {
    const r = fire(0, false);
    expect(r.angles.length).toBe(1);
  });

  it('three arrows with enchant', () => {
    const r = fire(0, true);
    expect(r.angles.length).toBe(3);
  });

  it('outer arrows spread', () => {
    const r = fire(0, true);
    expect(r.angles[0]).toBe(-MULTISHOT_EXTRA_ARROW_SPREAD_DEG);
    expect(r.angles[2]).toBe(MULTISHOT_EXTRA_ARROW_SPREAD_DEG);
  });

  it('center is pickupable', () => {
    expect(fire(0, true).primary).toBe(1);
  });

  it('one arrow consumed', () => {
    expect(consumesOneArrow()).toBe(true);
  });

  it('incompat piercing', () => {
    expect(incompatibleWith()).toContain('piercing');
  });
});
