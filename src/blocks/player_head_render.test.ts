import { describe, it, expect } from 'vitest';
import {
  wearableAs,
  witherSkullWeaponCraft,
  wearingCreeperHeadReducesCreeperDetection,
} from './player_head_render';

describe('player head render', () => {
  it('all wear as helmet', () => {
    expect(wearableAs('player')).toBe('helmet');
    expect(wearableAs('dragon')).toBe('helmet');
  });

  it('only wither skull crafts wither', () => {
    expect(witherSkullWeaponCraft('wither_skeleton')).toBe(true);
    expect(witherSkullWeaponCraft('skeleton')).toBe(false);
  });

  it('creeper head halves detection', () => {
    expect(wearingCreeperHeadReducesCreeperDetection('creeper')).toBe(0.5);
    expect(wearingCreeperHeadReducesCreeperDetection('player')).toBe(1);
  });
});
