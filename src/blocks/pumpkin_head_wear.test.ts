import { describe, it, expect } from 'vitest';
import {
  detectionRangeMultiplier,
  hasPumpkinOverlay,
  chargedCreeperDrop,
} from './pumpkin_head_wear';

describe('headwear', () => {
  it('pumpkin blocks enderman', () => {
    expect(detectionRangeMultiplier({ wornHead: 'carved_pumpkin', mobType: 'enderman' })).toBe(0);
  });

  it('skull halves same-mob', () => {
    expect(detectionRangeMultiplier({ wornHead: 'zombie_head', mobType: 'zombie' })).toBe(0.5);
  });

  it('unrelated = 1', () => {
    expect(detectionRangeMultiplier({ wornHead: 'zombie_head', mobType: 'creeper' })).toBe(1);
  });

  it('pumpkin overlay', () => {
    expect(hasPumpkinOverlay('carved_pumpkin')).toBe(true);
    expect(hasPumpkinOverlay(null)).toBe(false);
  });

  it('charged creeper drops head', () => {
    expect(chargedCreeperDrop('skeleton')).toBe('webmc:skeleton_skull');
    expect(chargedCreeperDrop('cow')).toBeNull();
  });

  it('piglin drops head on charged creeper kill (wiki: 1.20+)', () => {
    expect(chargedCreeperDrop('piglin')).toBe('webmc:piglin_head');
  });

  it('wither skeleton skull and piglin head halve detection', () => {
    // Wiki (minecraft.wiki/w/Mob_Head): wearing the matching mob head
    // halves that mob's detection range. Old type used `wither_skull`
    // (the projectile ID, not the head item) and lacked piglin head.
    expect(
      detectionRangeMultiplier({
        wornHead: 'wither_skeleton_skull',
        mobType: 'wither_skeleton',
      }),
    ).toBe(0.5);
    expect(detectionRangeMultiplier({ wornHead: 'piglin_head', mobType: 'piglin' })).toBe(0.5);
  });
});
