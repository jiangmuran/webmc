import { describe, it, expect } from 'vitest';
import { startCredits, progress01, dismiss, shouldShow } from './endgame_credits';

describe('endgame credits', () => {
  it('progress 0 at start', () => {
    const p = startCredits(1000);
    expect(progress01(p, 1000)).toBe(0);
  });

  it('progress 1 at end', () => {
    const p = startCredits(0);
    expect(progress01(p, p.durationMs)).toBe(1);
  });

  it('dismiss finalizes progress', () => {
    const p = startCredits(0);
    expect(progress01(dismiss(p), 100)).toBe(1);
  });

  it('only first defeat shows', () => {
    expect(shouldShow(true)).toBe(true);
    expect(shouldShow(false)).toBe(false);
  });
});
