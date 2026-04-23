import { describe, it, expect } from 'vitest';
import { redstoneOutput, powersRailsBelow, POWERED_SIGNAL } from './detector_rail';

describe('detector rail', () => {
  it('full signal under cart', () => {
    expect(redstoneOutput({ cartAbove: true })).toBe(POWERED_SIGNAL);
  });

  it('no signal without cart', () => {
    expect(redstoneOutput({ cartAbove: false })).toBe(0);
  });

  it('powers rail below when cart above', () => {
    expect(powersRailsBelow({ cartAbove: true })).toBe(true);
    expect(powersRailsBelow({ cartAbove: false })).toBe(false);
  });
});
