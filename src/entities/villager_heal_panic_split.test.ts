import { describe, it, expect } from 'vitest';
import { speedMultiplier, refuge, durationTicks } from './villager_heal_panic_split';

describe('villager panic split', () => {
  it('illager fastest', () => {
    expect(speedMultiplier('illager')).toBeGreaterThan(speedMultiplier('hurt'));
  });

  it('raid → house', () => {
    expect(refuge('raid')).toBe('house');
  });

  it('hostile → golem', () => {
    expect(refuge('hostile')).toBe('iron_golem');
  });

  it('none no refuge', () => {
    expect(refuge('none')).toBe('none');
  });

  it('illager longest', () => {
    expect(durationTicks('illager')).toBeGreaterThan(durationTicks('hurt'));
  });
});
