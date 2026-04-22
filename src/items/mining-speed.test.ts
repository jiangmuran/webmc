import { describe, it, expect } from 'vitest';
import { breakTime, canHarvest } from './mining-speed';

describe('mining-speed', () => {
  it('stone with hand is much slower than stone with pickaxe', () => {
    const hand = breakTime({
      hardness: 1.5,
      material: 'stone',
      toolKind: 'hand',
      toolTier: 0,
    });
    const pick = breakTime({
      hardness: 1.5,
      material: 'stone',
      toolKind: 'pickaxe',
      toolTier: 2,
    });
    expect(pick).toBeLessThan(hand);
  });

  it('iron pickaxe is faster than stone pickaxe on stone', () => {
    const stone = breakTime({
      hardness: 1.5,
      material: 'stone',
      toolKind: 'pickaxe',
      toolTier: 1,
    });
    const iron = breakTime({
      hardness: 1.5,
      material: 'stone',
      toolKind: 'pickaxe',
      toolTier: 2,
    });
    expect(iron).toBeLessThan(stone);
  });

  it('obsidian requires diamond to harvest', () => {
    expect(canHarvest({ material: 'obsidian', toolTier: 2 })).toBe(false);
    expect(canHarvest({ material: 'obsidian', toolTier: 3 })).toBe(true);
  });

  it('unbreakable returns Infinity', () => {
    const t = breakTime({
      hardness: -1,
      material: 'unbreakable',
      toolKind: 'pickaxe',
      toolTier: 4,
    });
    expect(t).toBe(Infinity);
  });

  it('efficiency enchant speeds up correct tool', () => {
    const base = breakTime({
      hardness: 1.5,
      material: 'stone',
      toolKind: 'pickaxe',
      toolTier: 2,
    });
    const enchanted = breakTime({
      hardness: 1.5,
      material: 'stone',
      toolKind: 'pickaxe',
      toolTier: 2,
      efficiency: 3,
    });
    expect(enchanted).toBeLessThan(base);
  });

  it('in-water penalty is 5x unless aqua affinity', () => {
    const dry = breakTime({
      hardness: 1.5,
      material: 'stone',
      toolKind: 'pickaxe',
      toolTier: 2,
    });
    const wet = breakTime({
      hardness: 1.5,
      material: 'stone',
      toolKind: 'pickaxe',
      toolTier: 2,
      inWater: true,
    });
    const wetAqua = breakTime({
      hardness: 1.5,
      material: 'stone',
      toolKind: 'pickaxe',
      toolTier: 2,
      inWater: true,
      aquaAffinity: true,
    });
    expect(wet).toBeCloseTo(dry * 5, 3);
    expect(wetAqua).toBeCloseTo(dry, 3);
  });

  it('off-ground penalty is 5x', () => {
    const ground = breakTime({
      hardness: 1.5,
      material: 'stone',
      toolKind: 'pickaxe',
      toolTier: 2,
      onGround: true,
    });
    const air = breakTime({
      hardness: 1.5,
      material: 'stone',
      toolKind: 'pickaxe',
      toolTier: 2,
      onGround: false,
    });
    expect(air).toBeCloseTo(ground * 5, 3);
  });
});
