import { describe, it, expect } from 'vitest';
import { canSleep, skipsNight, skipsThunder } from './bed_sleep_trigger';

describe('bed sleep trigger', () => {
  it('day no sleep', () => {
    expect(canSleep({ phase: 'day', hostilesNear: false, raidInProgress: false })).toBe(false);
  });

  it('night sleep', () => {
    expect(canSleep({ phase: 'night', hostilesNear: false, raidInProgress: false })).toBe(true);
  });

  it('hostiles block', () => {
    expect(canSleep({ phase: 'night', hostilesNear: true, raidInProgress: false })).toBe(false);
  });

  it('active raid blocks (wiki: not Bad Omen alone)', () => {
    expect(canSleep({ phase: 'night', hostilesNear: false, raidInProgress: true })).toBe(false);
  });

  it('night skip', () => {
    expect(skipsNight({ phase: 'night', hostilesNear: false, raidInProgress: false })).toBe(true);
  });

  it('thunder skip', () => {
    expect(skipsThunder({ phase: 'thunder', hostilesNear: false, raidInProgress: false })).toBe(
      true,
    );
  });
});
