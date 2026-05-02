import { describe, it, expect } from 'vitest';
import {
  speedMultiplier,
  jumpMultiplier,
  slideYVelocity,
  applyHoneyFallDamage,
  stickyConnection,
  ON_TOP_SPEED_MULT,
} from './honey_block_slow';

describe('honey block', () => {
  it('top slows', () => {
    expect(speedMultiplier({ standingOnTop: true, touchingSide: false })).toBe(ON_TOP_SPEED_MULT);
  });

  it('off honey = 1', () => {
    expect(speedMultiplier({ standingOnTop: false, touchingSide: false })).toBe(1);
  });

  it('jump reduced', () => {
    expect(jumpMultiplier({ standingOnTop: true, touchingSide: false })).toBeLessThan(1);
  });

  it('side slide down', () => {
    expect(slideYVelocity({ standingOnTop: false, touchingSide: true })).toBeLessThan(0);
  });

  it('fall damage reduced', () => {
    expect(applyHoneyFallDamage(10)).toBeLessThan(10);
  });

  it('sticks to honey only, NOT slime (wiki: honey/slime non-stick trick)', () => {
    expect(stickyConnection('webmc:honey_block')).toBe(true);
    // Wiki: slime + honey do NOT stick to each other — that's the
    // famous selective piston design pattern.
    expect(stickyConnection('webmc:slime_block')).toBe(false);
    expect(stickyConnection('webmc:stone')).toBe(false);
  });
});
