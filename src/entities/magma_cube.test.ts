import { describe, it, expect } from 'vitest';
import {
  attackDamageBySize,
  fallDamage,
  fireImmune,
  makeMagmaCube,
  maxHealthForSize,
  onDeath,
} from './magma_cube';

describe('magma cube', () => {
  it('health scales with size', () => {
    expect(maxHealthForSize(1)).toBe(1);
    expect(maxHealthForSize(4)).toBe(16);
  });

  it('large cube splits into mediums', () => {
    const r = onDeath(4, () => 0.5);
    for (const c of r.children) expect(c).toBe(2);
  });

  it('small cube does not split', () => {
    const r = onDeath(1, () => 0);
    expect(r.children.length).toBe(0);
  });

  it('medium has chance to drop magma cream', () => {
    const r = onDeath(2, () => 0.1);
    expect(r.droppedMagmaCream).toBeGreaterThanOrEqual(0);
  });

  it('damage = size + 2 (wiki: 3 / 4 / 6 for small / medium / large)', () => {
    // Wiki (minecraft.wiki/w/Magma_Cube): "the attack strength is
    // its size + 2." Old small-cube damage was 2, off by one.
    expect(attackDamageBySize(1)).toBe(3);
    expect(attackDamageBySize(2)).toBe(4);
    expect(attackDamageBySize(4)).toBe(6);
  });

  it('fire immune + no fall damage', () => {
    expect(fireImmune()).toBe(true);
    expect(fallDamage()).toBe(0);
  });

  it('makeMagmaCube starts at max HP', () => {
    const c = makeMagmaCube(1, 2, { x: 0, y: 0, z: 0 });
    expect(c.health).toBe(4);
  });
});
