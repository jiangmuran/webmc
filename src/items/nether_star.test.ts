import { describe, it, expect } from 'vitest';
import {
  craftBeacon,
  GLINT_COLOR,
  NETHER_STAR_DESPAWN_SEC,
  NETHER_STAR_ID,
  takesDamageFrom,
  witherDropStar,
} from './nether_star';

describe('nether star', () => {
  it('id constant', () => {
    expect(NETHER_STAR_ID).toBe('webmc:nether_star');
  });

  it('wither drops 1', () => {
    expect(witherDropStar().quantity).toBe(1);
  });

  it('never despawns', () => {
    expect(NETHER_STAR_DESPAWN_SEC).toBe(Infinity);
  });

  it('beacon requires 1 + 5 + 3', () => {
    expect(craftBeacon({ netherStars: 1, glass: 5, obsidian: 3 })?.item).toBe('webmc:beacon');
    expect(craftBeacon({ netherStars: 0, glass: 5, obsidian: 3 })).toBeNull();
    expect(craftBeacon({ netherStars: 1, glass: 4, obsidian: 3 })).toBeNull();
  });

  it('immune to most damage', () => {
    expect(takesDamageFrom('lava')).toBe(false);
    expect(takesDamageFrom('explosion')).toBe(false);
    expect(takesDamageFrom('void')).toBe(true);
  });

  it('glint color is golden', () => {
    expect(GLINT_COLOR[0]).toBeGreaterThan(200);
  });
});
