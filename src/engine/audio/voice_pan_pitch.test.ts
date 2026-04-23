import { describe, it, expect } from 'vitest';
import { pan, pitch } from './voice_pan_pitch';

describe('voice pan pitch', () => {
  it('right side positive pan', () => {
    expect(
      pan({
        listenerX: 0,
        listenerY: 0,
        listenerZ: 0,
        listenerYaw: 0,
        sourceX: 10,
        sourceY: 0,
        sourceZ: 0,
        pitchShift: 1,
      }),
    ).toBeGreaterThan(0);
  });

  it('left side negative', () => {
    expect(
      pan({
        listenerX: 0,
        listenerY: 0,
        listenerZ: 0,
        listenerYaw: 0,
        sourceX: -10,
        sourceY: 0,
        sourceZ: 0,
        pitchShift: 1,
      }),
    ).toBeLessThan(0);
  });

  it('pitch clamps', () => {
    expect(
      pitch({
        listenerX: 0,
        listenerY: 0,
        listenerZ: 0,
        listenerYaw: 0,
        sourceX: 0,
        sourceY: 0,
        sourceZ: 0,
        pitchShift: 10,
      }),
    ).toBe(2);
    expect(
      pitch({
        listenerX: 0,
        listenerY: 0,
        listenerZ: 0,
        listenerYaw: 0,
        sourceX: 0,
        sourceY: 0,
        sourceZ: 0,
        pitchShift: 0.1,
      }),
    ).toBe(0.5);
  });
});
