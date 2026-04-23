import { describe, it, expect } from 'vitest';
import { isAdult, canChooseProfession, runsFromPlayer, GROWUP_TICKS } from './villager_child_growup';

describe('villager child growup', () => {
  it('baby not adult', () => {
    expect(isAdult({ ageTicks: 0 })).toBe(false);
  });

  it('adult at threshold', () => {
    expect(isAdult({ ageTicks: GROWUP_TICKS })).toBe(true);
  });

  it('adult can profess', () => {
    expect(canChooseProfession({ ageTicks: GROWUP_TICKS })).toBe(true);
  });

  it('child flees', () => {
    expect(runsFromPlayer({ ageTicks: 0 })).toBe(true);
  });
});
