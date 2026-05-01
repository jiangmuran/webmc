import { describe, it, expect } from 'vitest';
import {
  blockFor,
  onBreak,
  cascadeRadius,
  CASCADE_RADIUS_XZ,
  CASCADE_RADIUS_Y,
} from './silverfish_infest';

describe('silverfish infest', () => {
  it('strips infested_ prefix', () => {
    expect(blockFor('infested_stone')).toBe('stone');
    expect(blockFor('infested_deepslate')).toBe('deepslate');
  });

  it('silk touch drops block', () => {
    expect(onBreak({ kind: 'infested_stone', hitByPlayer: true, silkTouch: true })).toEqual({
      kind: 'dropped_block',
      id: 'infested_stone',
    });
  });

  it('player break releases mob', () => {
    expect(onBreak({ kind: 'infested_stone', hitByPlayer: true, silkTouch: false })).toEqual({
      kind: 'released_mob',
    });
  });

  it('cascade radius matches wiki 21×11×21 area', () => {
    // minecraft.wiki/w/Silverfish: "21×11×21 area" → ±10 XZ, ±5 Y.
    // Sibling silverfish_summon.ts uses these same values.
    expect(CASCADE_RADIUS_XZ).toBe(10);
    expect(CASCADE_RADIUS_Y).toBe(5);
    expect(cascadeRadius()).toBe(CASCADE_RADIUS_XZ);
  });
});
