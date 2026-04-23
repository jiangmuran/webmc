import { describe, it, expect } from 'vitest';
import { effectsOf, curesZombieVillager } from './golden_apple_effect';

describe('golden apple effect', () => {
  it('enchanted has resistance', () => {
    expect(effectsOf('enchanted').some((e) => e.id === 'resistance')).toBe(true);
  });

  it('normal lacks resistance', () => {
    expect(effectsOf('normal').some((e) => e.id === 'resistance')).toBe(false);
  });

  it('enchanted regen lasts longer', () => {
    const n = effectsOf('normal').find((e) => e.id === 'regeneration');
    const e = effectsOf('enchanted').find((e) => e.id === 'regeneration');
    expect((e?.durationTicks ?? 0) > (n?.durationTicks ?? 0)).toBe(true);
  });

  it('both cure zombie villager', () => {
    expect(curesZombieVillager('normal')).toBe(true);
    expect(curesZombieVillager('enchanted')).toBe(true);
  });
});
