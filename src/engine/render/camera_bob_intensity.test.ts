import { describe, it, expect } from 'vitest';
import { bobAmount, bobY } from './camera_bob_intensity';

describe('camera bob intensity', () => {
  it('disabled zero', () => {
    expect(bobAmount(1, false)).toBe(0);
  });

  it('enabled nonzero', () => {
    expect(bobAmount(1, true)).toBeGreaterThan(0);
  });

  it('caps at speed 1', () => {
    expect(bobAmount(10, true)).toBe(bobAmount(1, true));
  });

  it('sinusoidal', () => {
    expect(Math.abs(bobY(0, 1, true))).toBeLessThan(0.01);
  });
});
