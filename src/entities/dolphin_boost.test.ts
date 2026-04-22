import { describe, it, expect } from 'vitest';
import {
  playerHasGrace,
  swimSpeedMult,
  feed,
  GRACE_RADIUS,
  GRACE_SPEED_MULT,
  type DolphinAffinity,
} from './dolphin_boost';

describe('dolphin', () => {
  it('grace within radius', () => {
    expect(playerHasGrace(GRACE_RADIUS)).toBe(true);
    expect(playerHasGrace(GRACE_RADIUS + 1)).toBe(false);
  });

  it('speed mult', () => {
    expect(swimSpeedMult(true)).toBe(GRACE_SPEED_MULT);
    expect(swimSpeedMult(false)).toBe(1);
  });

  it('feed with fish leads', () => {
    const a: DolphinAffinity = {
      pettedByPlayer: false,
      feedingPlayer: null,
      leadingToStructure: null,
    };
    expect(feed(a, 'p1', 'webmc:raw_cod')).toBe(true);
    expect(a.leadingToStructure).toBe('shipwreck');
  });

  it('feed with non-fish fails', () => {
    const a: DolphinAffinity = {
      pettedByPlayer: false,
      feedingPlayer: null,
      leadingToStructure: null,
    };
    expect(feed(a, 'p1', 'webmc:bone')).toBe(false);
  });
});
