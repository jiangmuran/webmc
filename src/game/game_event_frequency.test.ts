import { describe, it, expect } from 'vitest';
import { delayTicksBetween, inRange, isOccludedBy } from './game_event_frequency';

describe('game event frequency', () => {
  it('delay scales with distance', () => {
    expect(delayTicksBetween(5, 0, 0)).toBe(5);
  });

  it('in-range check', () => {
    expect(inRange({ id: 'x', sourceX: 0, sourceY: 0, sourceZ: 0, time: 0 }, 5, 0, 0, 16)).toBe(
      true,
    );
    expect(inRange({ id: 'x', sourceX: 0, sourceY: 0, sourceZ: 0, time: 0 }, 50, 0, 0, 16)).toBe(
      false,
    );
  });

  it('wool occludes', () => {
    expect(isOccludedBy('wool')).toBe(true);
    expect(isOccludedBy('stone')).toBe(false);
  });
});
