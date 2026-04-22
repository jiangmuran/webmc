import { describe, it, expect } from 'vitest';
import { tickBoat, type Boat, type BoatLookup } from './boat';

class Water implements BoatLookup {
  isWater(): boolean {
    return true;
  }
  isSolid(): boolean {
    return false;
  }
}

class Dry implements BoatLookup {
  isWater(): boolean {
    return false;
  }
  isSolid(): boolean {
    return false;
  }
}

function boat(): Boat {
  return {
    id: 1,
    position: { x: 0, y: 60, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    yaw: 0,
    hasRider: false,
  };
}

describe('boat', () => {
  it('floats on water', () => {
    const b = boat();
    const water = new Water();
    for (let i = 0; i < 40; i++) tickBoat(b, 1 / 20, { forward: 0, turn: 0 }, water);
    // Not gaining a lot of depth; y change bounded by buoyancy clamp.
    expect(Math.abs(b.position.y - 60)).toBeLessThan(2);
  });

  it('sinks on dry land (gravity)', () => {
    const b = boat();
    const dry = new Dry();
    for (let i = 0; i < 20; i++) tickBoat(b, 1 / 20, { forward: 0, turn: 0 }, dry);
    expect(b.position.y).toBeLessThan(60);
  });

  it('accelerates with rider + forward input', () => {
    const b = boat();
    b.hasRider = true;
    const water = new Water();
    for (let i = 0; i < 10; i++) {
      tickBoat(b, 1 / 20, { forward: 1, turn: 0 }, water);
    }
    expect(Math.hypot(b.velocity.x, b.velocity.z)).toBeGreaterThan(0);
  });

  it('turns when rider applies turn input', () => {
    const b = boat();
    b.hasRider = true;
    const water = new Water();
    for (let i = 0; i < 10; i++) tickBoat(b, 1 / 20, { forward: 0, turn: 1 }, water);
    expect(b.yaw).toBeGreaterThan(0);
  });

  it('coasts to stop without rider input', () => {
    const b = boat();
    b.velocity.x = 5;
    const water = new Water();
    for (let i = 0; i < 200; i++) tickBoat(b, 1 / 20, { forward: 0, turn: 0 }, water);
    expect(Math.abs(b.velocity.x)).toBeLessThan(0.1);
  });

  it('max speed clamped on sustained input', () => {
    const b = boat();
    b.hasRider = true;
    const water = new Water();
    for (let i = 0; i < 200; i++) {
      tickBoat(b, 1 / 20, { forward: 1, turn: 0 }, water);
    }
    const speed = Math.hypot(b.velocity.x, b.velocity.z);
    expect(speed).toBeLessThanOrEqual(5.01);
  });
});
