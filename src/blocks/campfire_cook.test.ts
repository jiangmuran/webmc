import { describe, it, expect } from 'vitest';
import {
  makeCampfire,
  addItem,
  tickCampfire,
  extinguish,
  COOK_TICKS,
  isCookable,
} from './campfire_cook';

describe('campfire cook', () => {
  it('cookable list', () => {
    expect(isCookable('webmc:beef')).toBe(true);
    expect(isCookable('webmc:stone')).toBe(false);
  });

  it('adds and cooks', () => {
    const c = makeCampfire();
    expect(addItem(c, 'webmc:beef', 0)).toBe(true);
    expect(tickCampfire(c, COOK_TICKS - 1).dropped).toEqual([]);
    const r = tickCampfire(c, COOK_TICKS);
    expect(r.dropped).toEqual(['webmc:cooked_beef']);
  });

  it('cap 4', () => {
    const c = makeCampfire();
    for (let i = 0; i < 4; i++) addItem(c, 'webmc:porkchop', 0);
    expect(addItem(c, 'webmc:porkchop', 0)).toBe(false);
  });

  it('unlit rejects', () => {
    const c = makeCampfire();
    extinguish(c);
    expect(addItem(c, 'webmc:beef', 0)).toBe(false);
  });

  it('rejects non-cookable', () => {
    const c = makeCampfire();
    expect(addItem(c, 'webmc:stone', 0)).toBe(false);
  });
});
