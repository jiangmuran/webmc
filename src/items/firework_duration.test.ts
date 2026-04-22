import { describe, it, expect } from 'vitest';
import {
  boostSeconds,
  craftFirework,
  crossbowDistance,
  DISPENSER_LAUNCH_SPEED,
  MAX_FLIGHT_DURATION,
} from './firework_duration';

describe('firework duration', () => {
  it('crafts with 1 paper + gunpowder', () => {
    const r = craftFirework({ gunpowder: 2, paper: 1, stars: 0 });
    expect(r.success).toBe(true);
    expect(r.flightDuration).toBe(2);
  });

  it('cap at 3', () => {
    const r = craftFirework({ gunpowder: 5, paper: 1, stars: 0 });
    expect(r.flightDuration).toBe(MAX_FLIGHT_DURATION);
  });

  it('refuses without paper', () => {
    expect(craftFirework({ gunpowder: 1, paper: 0, stars: 0 }).success).toBe(false);
  });

  it('stars clamped to 7', () => {
    expect(craftFirework({ gunpowder: 1, paper: 1, stars: 15 }).starCount).toBe(7);
  });

  it('boost seconds scales', () => {
    expect(boostSeconds(3)).toBeGreaterThan(boostSeconds(1));
  });

  it('crossbow distance scales', () => {
    expect(crossbowDistance(3)).toBe(60);
  });

  it('dispenser launch speed exported', () => {
    expect(DISPENSER_LAUNCH_SPEED).toBe(1);
  });
});
