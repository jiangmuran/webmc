import { describe, it, expect } from 'vitest';
import {
  DESERT_TEMPLE_LOOT,
  desertTempleLayout,
  rollDesertTempleLoot,
  TNT_FUSE_TICKS,
} from './desert_temple';

describe('desert temple', () => {
  it('has 4 chests and 9 TNT', () => {
    const l = desertTempleLayout({ x: 0, y: 60, z: 0 });
    expect(l.chestCount).toBe(4);
    expect(l.tntCount).toBe(9);
  });

  it('size is 21×15×21', () => {
    const l = desertTempleLayout({ x: 0, y: 60, z: 0 });
    expect(l.size).toEqual({ width: 21, height: 15, depth: 21 });
  });

  it('trap plate is centered', () => {
    const l = desertTempleLayout({ x: 100, y: 70, z: 200 });
    expect(l.trapPlatePos.x).toBe(110);
    expect(l.trapPlatePos.z).toBe(210);
  });

  it('rollLoot returns a valid kind', () => {
    const item = rollDesertTempleLoot(0.001);
    const validKinds = DESERT_TEMPLE_LOOT.map((e) => e.kind);
    expect(validKinds).toContain(item);
  });

  it('bone is the most common category by weight', () => {
    const boneW = DESERT_TEMPLE_LOOT.find((e) => e.kind === 'bone')?.weight ?? 0;
    const diamondW = DESERT_TEMPLE_LOOT.find((e) => e.kind === 'diamond')?.weight ?? 0;
    expect(boneW).toBeGreaterThan(diamondW);
  });

  it('tnt fuse is 80 ticks', () => {
    expect(TNT_FUSE_TICKS).toBe(80);
  });
});
