import { describe, it, expect } from 'vitest';
import { blockFor, onBreak, cascadeRadius } from './silverfish_infest';

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

  it('cascade radius 2', () => {
    expect(cascadeRadius()).toBe(2);
  });
});
