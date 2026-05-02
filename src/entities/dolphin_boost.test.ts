import { describe, it, expect } from 'vitest';
import {
  playerHasGrace,
  swimSpeedMult,
  feed,
  GRACE_RADIUS,
  GRACE_SPEED_MULT,
  GRACE_SUSTAIN_RADIUS,
  GRACE_TRIGGER_RADIUS,
  type DolphinAffinity,
} from './dolphin_boost';

describe('dolphin', () => {
  it('grace trigger radius 9 / sustain radius 15 (wiki)', () => {
    expect(GRACE_TRIGGER_RADIUS).toBe(9);
    expect(GRACE_SUSTAIN_RADIUS).toBe(15);
    expect(GRACE_RADIUS).toBe(GRACE_TRIGGER_RADIUS);
  });

  it('grace triggers within 9 blocks', () => {
    expect(playerHasGrace(GRACE_TRIGGER_RADIUS)).toBe(true);
    expect(playerHasGrace(GRACE_TRIGGER_RADIUS + 1)).toBe(false);
  });

  it('grace sustains within 15 blocks once triggered', () => {
    expect(playerHasGrace(12, true)).toBe(true);
    expect(playerHasGrace(GRACE_SUSTAIN_RADIUS, true)).toBe(true);
    expect(playerHasGrace(GRACE_SUSTAIN_RADIUS + 1, true)).toBe(false);
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

  it('feed with tropical_fish or pufferfish leads (wiki: any raw fish)', () => {
    for (const fish of ['webmc:tropical_fish', 'webmc:pufferfish']) {
      const a: DolphinAffinity = {
        pettedByPlayer: false,
        feedingPlayer: null,
        leadingToStructure: null,
      };
      expect(feed(a, 'p1', fish)).toBe(true);
      expect(a.leadingToStructure).toBe('shipwreck');
    }
  });
});
