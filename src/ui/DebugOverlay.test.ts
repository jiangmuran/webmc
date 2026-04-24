import { describe, it, expect } from 'vitest';
import { facingFromYaw } from './DebugOverlay';

describe('facingFromYaw', () => {
  // Camera lookVector at yaw=0, pitch=0 is (0,0,-1) i.e. pointing north.
  it('yaw 0 → north', () => {
    expect(facingFromYaw(0)).toBe('north');
  });
  it('yaw π/2 → west', () => {
    expect(facingFromYaw(Math.PI / 2)).toBe('west');
  });
  it('yaw π → south', () => {
    expect(facingFromYaw(Math.PI)).toBe('south');
  });
  it('yaw 3π/2 → east', () => {
    expect(facingFromYaw((3 * Math.PI) / 2)).toBe('east');
  });
  it('negative yaw (mouse right rotation) wraps correctly', () => {
    expect(facingFromYaw(-Math.PI / 2)).toBe('east');
  });
});
