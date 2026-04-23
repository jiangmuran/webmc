import { describe, it, expect } from 'vitest';
import { silverfishSpawns, dropsBlockItem, tntExplosionSpawnsExtra } from './infested_stone_reveal';

describe('infested stone reveal', () => {
  it('spawns without silk', () => {
    expect(
      silverfishSpawns({ block: 'infested_stone', hasSilkTouch: false, powerLevel: 0 }),
    ).toBe(true);
  });

  it('silk suppresses', () => {
    expect(
      silverfishSpawns({ block: 'infested_stone', hasSilkTouch: true, powerLevel: 0 }),
    ).toBe(false);
  });

  it('plain stone no spawn', () => {
    expect(silverfishSpawns({ block: 'stone', hasSilkTouch: false, powerLevel: 0 })).toBe(false);
  });

  it('silk drops block', () => {
    expect(
      dropsBlockItem({ block: 'infested_stone', hasSilkTouch: true, powerLevel: 0 }),
    ).toBe('infested_stone');
  });

  it('tnt spawns extra', () => {
    expect(
      tntExplosionSpawnsExtra({ block: 'infested_stone', hasSilkTouch: false, powerLevel: 5 }),
    ).toBe(true);
  });
});
