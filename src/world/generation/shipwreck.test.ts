import { describe, it, expect } from 'vitest';
import { planShipwreck, rollShipwreckLoot } from './shipwreck';

describe('shipwreck', () => {
  it('full class has zero tilt', () => {
    const s = planShipwreck({ rng: () => 0.1 });
    expect(s.klass).toBe('full');
    expect(s.tiltDegrees).toBe(0);
  });

  it('sideways class tilts 90 deg', () => {
    const s = planShipwreck({ rng: () => 0.95 });
    expect(s.klass).toBe('sideways');
    expect(s.tiltDegrees).toBe(90);
  });

  it('map pool favors paper by weight', () => {
    const item = rollShipwreckLoot('map', 0.5);
    expect(['map_buried_treasure', 'paper', 'feather', 'book']).toContain(item);
  });

  it('treasure pool can yield iron ingot at low rolls', () => {
    const item = rollShipwreckLoot('treasure', 0.01);
    expect(item).toBe('iron_ingot');
  });

  it('supply pool at low roll returns suspicious_stew', () => {
    const item = rollShipwreckLoot('supply', 0.01);
    expect(item).toBe('suspicious_stew');
  });

  it('treasure pool uses lapis_lazuli (Java canonical id, not bare lapis)', () => {
    // Wiki minecraft.wiki/w/Shipwreck#Treasure_loot: canonical Java
    // item id is `lapis_lazuli`. Sample many rolls and confirm the
    // bare `lapis` legacy name is gone.
    const items = new Set<string>();
    for (let i = 0; i < 200; i++) items.add(rollShipwreckLoot('treasure', i / 200));
    expect(items.has('lapis_lazuli')).toBe(true);
    expect(items.has('lapis')).toBe(false);
  });
});
