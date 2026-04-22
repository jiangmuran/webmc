import { describe, it, expect } from 'vitest';
import { boneMealLilyPad, breakLilyPad, canPlaceLilyPad, onBoatCollide } from './lily_pad';

describe('lily pad', () => {
  it('can place on water with air above', () => {
    expect(canPlaceLilyPad({ targetBlock: 'webmc:water', aboveIsAir: true })).toBe(true);
  });

  it('rejects on dirt', () => {
    expect(canPlaceLilyPad({ targetBlock: 'webmc:dirt', aboveIsAir: true })).toBe(false);
  });

  it('rejects if blocked above', () => {
    expect(canPlaceLilyPad({ targetBlock: 'webmc:water', aboveIsAir: false })).toBe(false);
  });

  it('boat collision breaks without drop', () => {
    const r = onBoatCollide();
    expect(r.broken).toBe(true);
    expect(r.drops.length).toBe(0);
  });

  it('hand-break drops the pad', () => {
    const r = breakLilyPad(false);
    expect(r.drops[0]?.item).toBe('webmc:lily_pad');
  });

  it('bone meal does nothing', () => {
    expect(boneMealLilyPad()).toBe(false);
  });
});
