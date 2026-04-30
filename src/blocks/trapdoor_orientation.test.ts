import { describe, it, expect } from 'vitest';
import {
  blocksMovementWhenClosed,
  isClimbable,
  opensFromRedstone,
  attachedFace,
} from './trapdoor_orientation';

const base = { facing: 'north' as const, half: 'bottom' as const, open: false, powered: false };

describe('trapdoor orientation', () => {
  it('closed blocks', () => {
    expect(blocksMovementWhenClosed(base)).toBe(true);
  });

  it('open trapdoor only climbable when ladder is below (wiki)', () => {
    expect(isClimbable({ ...base, open: true }, 'ladder')).toBe(true);
    // Without a ladder below, an open trapdoor is just passable, not climbable.
    expect(isClimbable({ ...base, open: true }, 'other')).toBe(false);
    // Default-arg overload also defaults to non-climbable.
    expect(isClimbable({ ...base, open: true })).toBe(false);
  });

  it('redstone opens', () => {
    expect(opensFromRedstone({ ...base, powered: true })).toBe(true);
  });

  it('top half = ceiling', () => {
    expect(attachedFace({ ...base, half: 'top' })).toBe('ceiling');
  });
});
