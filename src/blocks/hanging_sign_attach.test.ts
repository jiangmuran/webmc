import { describe, it, expect } from 'vitest';
import {
  pickAttachment,
  canWaxInk,
  HANGING_SIGN_LINES,
  HANGING_SIGN_MAX_CHARS_PER_LINE,
} from './hanging_sign_attach';

describe('hanging sign attach', () => {
  it('ceiling when above solid', () => {
    const a = pickAttachment({ solidAbove: true, solidSides: [false, false, false, false] });
    expect(a?.kind).toBe('ceiling');
  });

  it('wall arm when side solid', () => {
    const a = pickAttachment({ solidAbove: false, solidSides: [false, true, false, false] });
    expect(a).toEqual({ kind: 'wall_arm', facing: 'east' });
  });

  it('no attachment when nothing', () => {
    expect(
      pickAttachment({ solidAbove: false, solidSides: [false, false, false, false] }),
    ).toBeNull();
  });

  it('can wax', () => {
    expect(canWaxInk()).toBe(true);
  });

  it('4 lines', () => {
    expect(HANGING_SIGN_LINES).toBe(4);
    expect(HANGING_SIGN_MAX_CHARS_PER_LINE).toBe(20);
  });
});
