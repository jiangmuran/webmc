import { describe, it, expect } from 'vitest';
import { canBreakDoor, makeVindicator } from './vindicator_doors';

describe('vindicator doors', () => {
  it('raid vindicator breaks wooden doors on normal/hard', () => {
    const v = makeVindicator(true);
    expect(canBreakDoor(v, { blockName: 'webmc:oak_door', difficulty: 'hard' })).toBe(true);
    expect(canBreakDoor(v, { blockName: 'webmc:oak_door', difficulty: 'normal' })).toBe(true);
  });

  it('refuses iron doors', () => {
    const v = makeVindicator(true);
    expect(canBreakDoor(v, { blockName: 'webmc:iron_door', difficulty: 'hard' })).toBe(false);
  });

  it('out-of-raid never breaks doors', () => {
    const v = makeVindicator(false);
    expect(canBreakDoor(v, { blockName: 'webmc:oak_door', difficulty: 'hard' })).toBe(false);
  });

  it('easy difficulty refuses', () => {
    const v = makeVindicator(true);
    expect(canBreakDoor(v, { blockName: 'webmc:oak_door', difficulty: 'easy' })).toBe(false);
  });
});
