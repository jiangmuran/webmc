import { describe, it, expect } from 'vitest';
import { isGrownUp, scutesDroppedOnGrow, GROWN_TICKS } from './turtle_scute_drop';

describe('turtle scute drop', () => {
  it('grown at threshold', () => {
    expect(isGrownUp({ ageTicks: GROWN_TICKS })).toBe(true);
  });

  it('baby not grown', () => {
    expect(isGrownUp({ ageTicks: 100 })).toBe(false);
  });

  it('1 scute on grow', () => {
    expect(scutesDroppedOnGrow({ ageTicks: GROWN_TICKS })).toBe(1);
  });

  it('baby drops none', () => {
    expect(scutesDroppedOnGrow({ ageTicks: 0 })).toBe(0);
  });
});
