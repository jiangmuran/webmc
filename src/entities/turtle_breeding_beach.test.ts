import { describe, it, expect } from 'vitest';
import { canLayEgg, scuteDroppedAtAdult, homeBeachReturnsAt } from './turtle_breeding_beach';

describe('turtle breeding beach', () => {
  it('sand + water OK at any time of day (wiki: no daytime restriction)', () => {
    expect(canLayEgg({ onSand: true, waterNearby: true, daytime: true })).toBe(true);
    expect(canLayEgg({ onSand: true, waterNearby: true, daytime: false })).toBe(true);
    expect(canLayEgg({ onSand: true, waterNearby: true })).toBe(true);
  });

  it('no sand no lay', () => {
    expect(canLayEgg({ onSand: false, waterNearby: true, daytime: true })).toBe(false);
  });

  it('no water no lay', () => {
    expect(canLayEgg({ onSand: true, waterNearby: false, daytime: true })).toBe(false);
  });

  it('scute name', () => {
    expect(scuteDroppedAtAdult()).toBe('turtle_scute');
  });

  it('return to lay', () => {
    expect(homeBeachReturnsAt()).toBe('lay');
  });
});
