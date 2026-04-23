import { describe, it, expect } from 'vitest';
import { isTeleport, flagSeverity, correctionVector } from './anti_teleport_hack';

describe('anti teleport hack', () => {
  it('walking ok', () => {
    expect(
      isTeleport({
        prevX: 0,
        prevY: 0,
        prevZ: 0,
        nextX: 5,
        nextY: 0,
        nextZ: 0,
        dtMs: 1000,
        maxSpeed: 10,
      }),
    ).toBe(false);
  });

  it('1000m/s is teleport', () => {
    expect(
      isTeleport({
        prevX: 0,
        prevY: 0,
        prevZ: 0,
        nextX: 1000,
        nextY: 0,
        nextZ: 0,
        dtMs: 100,
        maxSpeed: 10,
      }),
    ).toBe(true);
  });

  it('zero dt safe', () => {
    expect(
      isTeleport({
        prevX: 0,
        prevY: 0,
        prevZ: 0,
        nextX: 100,
        nextY: 0,
        nextZ: 0,
        dtMs: 0,
        maxSpeed: 10,
      }),
    ).toBe(false);
  });

  it('severity positive when over', () => {
    expect(
      flagSeverity({
        prevX: 0,
        prevY: 0,
        prevZ: 0,
        nextX: 30,
        nextY: 0,
        nextZ: 0,
        dtMs: 1000,
        maxSpeed: 5,
      }),
    ).toBeGreaterThan(0);
  });

  it('correction is previous position', () => {
    const c = correctionVector({
      prevX: 1,
      prevY: 2,
      prevZ: 3,
      nextX: 99,
      nextY: 99,
      nextZ: 99,
      dtMs: 100,
      maxSpeed: 10,
    });
    expect(c).toEqual({ x: 1, y: 2, z: 3 });
  });
});
