import { describe, it, expect } from 'vitest';
import { canSleep, skipsNight, skipsThunder } from './bed_sleep_trigger';

describe('bed sleep trigger', () => {
  it('day no sleep', () => {
    expect(canSleep({ phase: 'day', hostilesNear: false, badOmen: false })).toBe(false);
  });

  it('night sleep', () => {
    expect(canSleep({ phase: 'night', hostilesNear: false, badOmen: false })).toBe(true);
  });

  it('hostiles block', () => {
    expect(canSleep({ phase: 'night', hostilesNear: true, badOmen: false })).toBe(false);
  });

  it('bad omen blocks', () => {
    expect(canSleep({ phase: 'night', hostilesNear: false, badOmen: true })).toBe(false);
  });

  it('night skip', () => {
    expect(skipsNight({ phase: 'night', hostilesNear: false, badOmen: false })).toBe(true);
  });

  it('thunder skip', () => {
    expect(skipsThunder({ phase: 'thunder', hostilesNear: false, badOmen: false })).toBe(true);
  });
});
