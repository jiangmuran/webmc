import { describe, it, expect } from 'vitest';
import { signalStrength, pulsesOnPass, type DetectorRailInput } from './detector_rail_signal';

describe('detector rail signal', () => {
  it('no cart zero', () => {
    expect(signalStrength({ cartAbove: false, cartType: 'normal' })).toBe(0);
  });

  it('normal cart full signal', () => {
    expect(signalStrength({ cartAbove: true, cartType: 'normal' })).toBe(15);
  });

  it('empty chest cart low signal', () => {
    const i: DetectorRailInput = { cartAbove: true, cartType: 'chest', cartFilledFraction: 0 };
    expect(signalStrength(i)).toBe(1);
  });

  it('full chest cart 15', () => {
    expect(signalStrength({ cartAbove: true, cartType: 'chest', cartFilledFraction: 1 })).toBe(15);
  });

  it('pulse on pass rising edge', () => {
    expect(pulsesOnPass(false, true)).toBe(true);
    expect(pulsesOnPass(true, true)).toBe(false);
  });
});
