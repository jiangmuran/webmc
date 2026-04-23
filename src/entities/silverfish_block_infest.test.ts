import { describe, it, expect } from 'vitest';
import { spawnsOnBreak, infestedName } from './silverfish_block_infest';

describe('silverfish block infest', () => {
  it('infested block spawns silverfish', () => {
    expect(spawnsOnBreak({ hitBlock: 'infested_stone', hasSilkTouch: false })).toBe(true);
  });

  it('silk prevents', () => {
    expect(spawnsOnBreak({ hitBlock: 'infested_stone', hasSilkTouch: true })).toBe(false);
  });

  it('plain stone no spawn', () => {
    expect(spawnsOnBreak({ hitBlock: 'stone', hasSilkTouch: false })).toBe(false);
  });

  it('infest name', () => {
    expect(infestedName('stone')).toBe('infested_stone');
    expect(infestedName('wood')).toBeUndefined();
  });
});
