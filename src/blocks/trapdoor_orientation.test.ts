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

  it('open climbable', () => {
    expect(isClimbable({ ...base, open: true })).toBe(true);
  });

  it('redstone opens', () => {
    expect(opensFromRedstone({ ...base, powered: true })).toBe(true);
  });

  it('top half = ceiling', () => {
    expect(attachedFace({ ...base, half: 'top' })).toBe('ceiling');
  });
});
