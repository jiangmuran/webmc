import { describe, it, expect } from 'vitest';
import {
  rollSpire,
  dropsPopped,
  onlyGrowsOnEndStone,
  MIN_HEIGHT,
  MAX_HEIGHT,
} from './end_chorus_spires';

describe('end chorus spires', () => {
  it('height in range', () => {
    const s = rollSpire(() => 0.5);
    expect(s.height).toBeGreaterThanOrEqual(MIN_HEIGHT);
    expect(s.height).toBeLessThanOrEqual(MAX_HEIGHT);
  });

  it('trunk ≥1', () => {
    expect(rollSpire(() => 0).trunkRadius).toBeGreaterThanOrEqual(1);
  });

  it('drops popped', () => {
    expect(dropsPopped()).toBe('popped_chorus_fruit');
  });

  it('end stone only', () => {
    expect(onlyGrowsOnEndStone()).toBe(true);
  });
});
