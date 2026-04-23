import { describe, it, expect } from 'vitest';
import { pitchMultiplier, attenuation, DEFAULT_SPEED_OF_SOUND } from './doppler_shift';

describe('doppler shift', () => {
  it('stationary = 1', () => {
    expect(
      pitchMultiplier({
        listenerPos: { x: 0, y: 0, z: 0 },
        listenerVel: { x: 0, y: 0, z: 0 },
        sourcePos: { x: 10, y: 0, z: 0 },
        sourceVel: { x: 0, y: 0, z: 0 },
        speedOfSound: DEFAULT_SPEED_OF_SOUND,
      }),
    ).toBe(1);
  });

  it('source approaching listener → higher pitch', () => {
    const r = pitchMultiplier({
      listenerPos: { x: 0, y: 0, z: 0 },
      listenerVel: { x: 0, y: 0, z: 0 },
      sourcePos: { x: 10, y: 0, z: 0 },
      sourceVel: { x: -50, y: 0, z: 0 },
      speedOfSound: DEFAULT_SPEED_OF_SOUND,
    });
    expect(r).toBeGreaterThan(1);
  });

  it('source receding → lower pitch', () => {
    const r = pitchMultiplier({
      listenerPos: { x: 0, y: 0, z: 0 },
      listenerVel: { x: 0, y: 0, z: 0 },
      sourcePos: { x: 10, y: 0, z: 0 },
      sourceVel: { x: 50, y: 0, z: 0 },
      speedOfSound: DEFAULT_SPEED_OF_SOUND,
    });
    expect(r).toBeLessThan(1);
  });

  it('attenuation ≤ 1 far', () => {
    expect(attenuation(100)).toBeLessThan(1);
  });

  it('attenuation = 1 near', () => {
    expect(attenuation(0.5)).toBe(1);
  });
});
