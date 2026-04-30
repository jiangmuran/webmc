import { describe, it, expect } from 'vitest';
import { composterChance, harvestComposter, insertIntoComposter, makeComposter } from './composter';

describe('composter', () => {
  it('has per-item compost chances', () => {
    expect(composterChance('webmc:wheat_seeds')).toBe(0.3);
    expect(composterChance('webmc:cake')).toBe(1);
    expect(composterChance('webmc:stone')).toBe(0);
  });

  it('refuses non-compostable items', () => {
    const c = makeComposter();
    const r = insertIntoComposter(c, 'webmc:stone');
    expect(r.accepted).toBe(false);
    expect(c.level).toBe(0);
  });

  it('100% items always level up', () => {
    const c = makeComposter();
    const r = insertIntoComposter(c, 'webmc:cake');
    expect(r.leveledUp).toBe(true);
    expect(c.level).toBe(1);
  });

  it('harvest returns bone meal at level 8, resets', () => {
    const c = makeComposter();
    c.level = 8;
    const out = harvestComposter(c);
    expect(out).toBe('webmc:bone_meal');
    expect(c.level).toBe(0);
  });

  it('harvest returns null below level 8', () => {
    const c = makeComposter();
    c.level = 7;
    expect(harvestComposter(c)).toBeNull();
  });

  it('insert at full refuses', () => {
    const c = makeComposter();
    c.level = 8;
    const r = insertIntoComposter(c, 'webmc:cake');
    expect(r.accepted).toBe(false);
  });

  it('random-chance items always level up the first time (wiki: empty composter)', () => {
    // Wiki: "When the composter is empty, any compostable item added
    // always creates the first layer of compost, regardless of its
    // usual composting chance." (MC-196452)
    const empty = makeComposter();
    const firstHigh = insertIntoComposter(empty, 'webmc:wheat_seeds', () => 0.99);
    expect(firstHigh.leveledUp).toBe(true);
    expect(empty.level).toBe(1);
  });

  it('random-chance items roll once past level 1', () => {
    const c = makeComposter();
    c.level = 1;
    // Rig rng < chance = level up.
    const low = insertIntoComposter(c, 'webmc:wheat_seeds', () => 0.01);
    expect(low.leveledUp).toBe(true);
    // Rig rng > chance = accepted but no level up.
    const d = makeComposter();
    d.level = 1;
    const high = insertIntoComposter(d, 'webmc:wheat_seeds', () => 0.99);
    expect(high.leveledUp).toBe(false);
  });
});
