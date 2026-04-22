import { describe, it, expect } from 'vitest';
import { lineActive, xorPair, countActive, signalFromCount } from './tripwire_circuit';

describe('tripwire circuit', () => {
  it('line or', () => {
    expect(lineActive({ hookA: false, hookB: false })).toBe(false);
    expect(lineActive({ hookA: true, hookB: false })).toBe(true);
  });

  it('xor', () => {
    expect(xorPair({ hookA: true, hookB: false }, { hookA: false, hookB: false })).toBe(true);
    expect(xorPair({ hookA: true, hookB: false }, { hookA: true, hookB: false })).toBe(false);
  });

  it('count', () => {
    const n = countActive([
      { hookA: true, hookB: false },
      { hookA: false, hookB: false },
      { hookA: false, hookB: true },
    ]);
    expect(n).toBe(2);
  });

  it('signal clamped', () => {
    expect(signalFromCount(-1)).toBe(0);
    expect(signalFromCount(100)).toBe(15);
    expect(signalFromCount(5)).toBe(5);
  });
});
