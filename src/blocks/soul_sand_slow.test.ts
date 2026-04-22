import { describe, it, expect } from 'vitest';
import {
  isSoulBlock,
  sinkDepthFor,
  SOUL_FIRE_DAMAGE_BONUS,
  SOUL_SPEED_FRACTION,
  soulFireDamageTo,
  speedOnSoul,
} from './soul_sand_slow';

describe('soul sand slow', () => {
  it('soul sand detected', () => {
    expect(isSoulBlock('webmc:soul_sand')).toBe(true);
    expect(isSoulBlock('webmc:stone')).toBe(false);
  });

  it('slows without boots', () => {
    const s = speedOnSoul({
      blockBelow: 'webmc:soul_sand',
      baseSpeed: 1,
      soulSpeedLevel: 0,
      iceOverlaid: false,
    });
    expect(s).toBeCloseTo(SOUL_SPEED_FRACTION);
  });

  it('boots accelerate', () => {
    const s = speedOnSoul({
      blockBelow: 'webmc:soul_sand',
      baseSpeed: 1,
      soulSpeedLevel: 3,
      iceOverlaid: false,
    });
    expect(s).toBeGreaterThan(1);
  });

  it('stone unaffected', () => {
    const s = speedOnSoul({
      blockBelow: 'webmc:stone',
      baseSpeed: 1,
      soulSpeedLevel: 0,
      iceOverlaid: false,
    });
    expect(s).toBe(1);
  });

  it('sink depth only on soul sand', () => {
    expect(sinkDepthFor('webmc:soul_sand')).toBe(0.125);
    expect(sinkDepthFor('webmc:soul_soil')).toBe(0);
  });

  it('soul fire bonus', () => {
    expect(SOUL_FIRE_DAMAGE_BONUS).toBe(2);
  });

  it('phantom takes double soul fire', () => {
    expect(soulFireDamageTo('phantom', 3)).toBe(6);
    expect(soulFireDamageTo('zombie', 3)).toBe(3);
  });
});
