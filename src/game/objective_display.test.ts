import { describe, it, expect } from 'vitest';
import {
  setSlot,
  isShowing,
  formatScore,
  SIDEBAR_MAX_LINES,
  TAB_MAX_SCORES_VISIBLE,
} from './objective_display';

describe('objective display', () => {
  it('setSlot assigns', () => {
    const cfg = setSlot(
      { slot: 'sidebar', objectiveName: null },
      {
        name: 'kills',
        displayName: 'Kills',
        criterion: 'custom',
      },
    );
    expect(cfg.objectiveName).toBe('kills');
  });

  it('isShowing flag', () => {
    expect(isShowing({ slot: 'sidebar', objectiveName: 'x' })).toBe(true);
    expect(isShowing({ slot: 'sidebar', objectiveName: null })).toBe(false);
  });

  it('format line', () => {
    expect(formatScore('Steve', 42)).toBe('Steve: 42');
  });

  it('caps equal', () => {
    expect(SIDEBAR_MAX_LINES).toBe(15);
    expect(TAB_MAX_SCORES_VISIBLE).toBe(15);
  });
});
