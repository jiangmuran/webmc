import { describe, it, expect } from 'vitest';
import { makeCampfire, placeOnCampfire, tickCampfire } from './campfire';

describe('campfire', () => {
  it('places a cookable item on a lit campfire', () => {
    const c = makeCampfire();
    expect(placeOnCampfire(c, 'webmc:raw_beef')).toBe(true);
    expect(c.slots[0]?.itemName).toBe('webmc:raw_beef');
  });

  it('refuses non-cookable items', () => {
    const c = makeCampfire();
    expect(placeOnCampfire(c, 'webmc:stone')).toBe(false);
  });

  it('refuses to place when lit is false', () => {
    const c = makeCampfire();
    c.lit = false;
    expect(placeOnCampfire(c, 'webmc:raw_beef')).toBe(false);
  });

  it('fills all 4 slots then refuses', () => {
    const c = makeCampfire();
    for (let i = 0; i < 4; i++) placeOnCampfire(c, 'webmc:raw_beef');
    expect(placeOnCampfire(c, 'webmc:raw_beef')).toBe(false);
  });

  it('cooks and pops out after 30s', () => {
    const c = makeCampfire();
    placeOnCampfire(c, 'webmc:raw_beef');
    const res = tickCampfire(c, 31);
    expect(res.finishedItems).toContain('webmc:cooked_beef');
    expect(c.slots[0]).toBeNull();
  });

  it('does not cook when unlit', () => {
    const c = makeCampfire();
    placeOnCampfire(c, 'webmc:raw_beef');
    c.lit = false;
    const res = tickCampfire(c, 31);
    expect(res.finishedItems.length).toBe(0);
  });
});
