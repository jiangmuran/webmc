import { describe, it, expect } from 'vitest';
import { isOpening, canBeHitByArrow, tickOpen, MAX_PEEK } from './shulker_peek_open';

describe('shulker peek open', () => {
  const closed = { peekAmount: 0, attachedFace: 'up' as const, openTicks: 0 };
  const fullyOpen = { peekAmount: MAX_PEEK, attachedFace: 'up' as const, openTicks: 20 };

  it('idle closed', () => {
    expect(isOpening(closed)).toBe(false);
  });

  it('fully open can be hit', () => {
    expect(canBeHitByArrow(fullyOpen)).toBe(true);
  });

  it('closed cannot be hit', () => {
    expect(canBeHitByArrow(closed)).toBe(false);
  });

  it('tick advances peek', () => {
    const s = tickOpen(closed);
    expect(s.peekAmount).toBeGreaterThan(0);
  });
});
