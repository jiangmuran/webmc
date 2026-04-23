import { describe, it, expect } from 'vitest';
import { isLocked, output } from './repeater_lock';

describe('repeater lock', () => {
  it('side repeater locks', () => {
    expect(isLocked({ sideRepeaterPowered: true, wasPowered: true })).toBe(true);
  });

  it('locked holds previous state', () => {
    expect(output(false, { sideRepeaterPowered: true, wasPowered: true })).toBe(true);
  });

  it('unlocked follows input', () => {
    expect(output(true, { sideRepeaterPowered: false, wasPowered: false })).toBe(true);
  });
});
