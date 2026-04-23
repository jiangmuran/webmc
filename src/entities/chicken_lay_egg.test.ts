import { describe, it, expect } from 'vitest';
import { canLay, LAY_INTERVAL_MIN, LAY_INTERVAL_MAX } from './chicken_lay_egg';

describe('chicken lay egg', () => {
  it('jockey never lays', () => {
    expect(canLay({ ticksSinceLastLay: LAY_INTERVAL_MAX, isJockey: true }, () => 0)).toBe(false);
  });

  it('too soon no lay', () => {
    expect(canLay({ ticksSinceLastLay: 100, isJockey: false }, () => 0)).toBe(false);
  });

  it('past max always lays', () => {
    expect(canLay({ ticksSinceLastLay: LAY_INTERVAL_MAX, isJockey: false }, () => 0)).toBe(true);
  });

  it('lucky earlier', () => {
    expect(canLay({ ticksSinceLastLay: LAY_INTERVAL_MIN, isJockey: false }, () => 0)).toBe(true);
  });
});
