import { describe, it, expect } from 'vitest';
import { makeKnot, tieMob, untie, stretchState, MAX_MOBS_PER_KNOT } from './lead_tie';

describe('lead tie', () => {
  it('tie then untie', () => {
    const k = makeKnot(0, 64, 0);
    expect(tieMob(k, 'pig1')).toBe('ok');
    expect(tieMob(k, 'pig1')).toBe('already');
    expect(untie(k, 'pig1')).toBe(true);
    expect(untie(k, 'pig1')).toBe(false);
  });

  it('full at capacity', () => {
    const k = makeKnot(0, 0, 0);
    for (let i = 0; i < MAX_MOBS_PER_KNOT; i++) tieMob(k, `m${i}`);
    expect(tieMob(k, 'overflow')).toBe('full');
  });

  it('stretch bands', () => {
    expect(stretchState({ mob: { x: 0, y: 0, z: 0 }, knot: { x: 0, y: 0, z: 0 } })).toBe('ok');
    expect(stretchState({ mob: { x: 11, y: 0, z: 0 }, knot: { x: 0, y: 0, z: 0 } })).toBe('pull');
    expect(stretchState({ mob: { x: 20, y: 0, z: 0 }, knot: { x: 0, y: 0, z: 0 } })).toBe('snap');
  });
});
