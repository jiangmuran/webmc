import { describe, it, expect } from 'vitest';
import {
  effectRadius,
  attacksHostileMobs,
  attackRangeBlocks,
  MIN_FRAME_FOR_ATTACK,
} from './conduit_attack_range';

describe('conduit attack range', () => {
  it('inactive radius 0', () => {
    expect(effectRadius({ activated: false, prismarineFrameBlocks: 100 })).toBe(0);
  });

  it('radius scales with frame size', () => {
    expect(effectRadius({ activated: true, prismarineFrameBlocks: 16 })).toBe(
      16 * Math.floor(16 / 7),
    );
  });

  it('radius caps at 96', () => {
    expect(effectRadius({ activated: true, prismarineFrameBlocks: 9999 })).toBe(96);
  });

  it('attacks only at min frame', () => {
    expect(
      attacksHostileMobs({ activated: true, prismarineFrameBlocks: MIN_FRAME_FOR_ATTACK - 1 }),
    ).toBe(false);
    expect(
      attacksHostileMobs({ activated: true, prismarineFrameBlocks: MIN_FRAME_FOR_ATTACK }),
    ).toBe(true);
  });

  it('attack range 8 when attacking', () => {
    expect(attackRangeBlocks({ activated: true, prismarineFrameBlocks: 42 })).toBe(8);
  });
});
