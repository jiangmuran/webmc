import { describe, it, expect } from 'vitest';
import { applyEnchant, type Enchanted } from './enchantment';
import { computeRiptide, tickLoyalty } from './trident';

function trident(): Enchanted {
  return { itemId: 1, count: 1, damage: 0 };
}

describe('trident riptide', () => {
  it('refuses when no riptide enchant', () => {
    const r = computeRiptide({
      trident: trident(),
      inWater: true,
      inRain: false,
      lookDirection: { x: 0, y: 1, z: 0 },
      chargeSec: 1,
    });
    expect(r.canLaunch).toBe(false);
  });

  it('refuses when not in water or rain', () => {
    const t = applyEnchant(trident(), 'riptide', 3);
    const r = computeRiptide({
      trident: t,
      inWater: false,
      inRain: false,
      lookDirection: { x: 0, y: 1, z: 0 },
      chargeSec: 1,
    });
    expect(r.canLaunch).toBe(false);
  });

  it('launches in water with riptide + 1s charge', () => {
    const t = applyEnchant(trident(), 'riptide', 3);
    const r = computeRiptide({
      trident: t,
      inWater: true,
      inRain: false,
      lookDirection: { x: 0, y: 1, z: 0 },
      chargeSec: 1,
    });
    expect(r.canLaunch).toBe(true);
    expect(r.launchVelocity.y).toBeGreaterThan(0);
  });

  it('refuses with <0.5s charge', () => {
    const t = applyEnchant(trident(), 'riptide', 1);
    const r = computeRiptide({
      trident: t,
      inWater: true,
      inRain: false,
      lookDirection: { x: 0, y: 1, z: 0 },
      chargeSec: 0.1,
    });
    expect(r.canLaunch).toBe(false);
  });
});

describe('trident loyalty', () => {
  it('pulls trident toward owner when stuck', () => {
    const t = applyEnchant(trident(), 'loyalty', 2);
    const delta = tickLoyalty(
      {
        trident: t,
        stuck: true,
        tridentPos: { x: 10, y: 0, z: 0 },
        ownerPos: { x: 0, y: 0, z: 0 },
      },
      1,
    );
    expect(delta.x).toBeLessThan(0);
  });

  it('no pull without loyalty', () => {
    const delta = tickLoyalty(
      {
        trident: trident(),
        stuck: true,
        tridentPos: { x: 10, y: 0, z: 0 },
        ownerPos: { x: 0, y: 0, z: 0 },
      },
      1,
    );
    expect(delta).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('no pull when not stuck', () => {
    const t = applyEnchant(trident(), 'loyalty', 2);
    const delta = tickLoyalty(
      {
        trident: t,
        stuck: false,
        tridentPos: { x: 10, y: 0, z: 0 },
        ownerPos: { x: 0, y: 0, z: 0 },
      },
      1,
    );
    expect(delta).toEqual({ x: 0, y: 0, z: 0 });
  });
});
