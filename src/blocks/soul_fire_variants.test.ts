import { describe, it, expect } from 'vitest';
import {
  igniteVariant,
  damagePerTick,
  piglinRepelled,
  soulSpeedMultiplier,
  SOUL_FIRE_DAMAGE_PER_TICK,
  FIRE_DAMAGE_PER_TICK,
} from './soul_fire_variants';

describe('soul fire', () => {
  it('soul variant from soul sand', () => {
    expect(igniteVariant('webmc:soul_sand')).toBe('webmc:soul_fire');
    expect(igniteVariant('webmc:stone')).toBe('webmc:fire');
  });

  it('damage increases', () => {
    expect(damagePerTick('webmc:fire')).toBe(FIRE_DAMAGE_PER_TICK);
    expect(damagePerTick('webmc:soul_fire')).toBe(SOUL_FIRE_DAMAGE_PER_TICK);
  });

  it('piglin repelled within radius', () => {
    expect(piglinRepelled({ x: 0, y: 0, z: 0 }, { x: 5, y: 0, z: 0 })).toBe(true);
    expect(piglinRepelled({ x: 0, y: 0, z: 0 }, { x: 20, y: 0, z: 0 })).toBe(false);
  });

  it('soul speed boost', () => {
    expect(soulSpeedMultiplier(0)).toBe(1);
    expect(soulSpeedMultiplier(1)).toBeGreaterThan(1);
    expect(soulSpeedMultiplier(3)).toBeGreaterThan(soulSpeedMultiplier(1));
  });
});
