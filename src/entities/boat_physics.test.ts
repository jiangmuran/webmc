import { describe, it, expect } from 'vitest';
import {
  speedMultiplier,
  turnRate,
  thrust,
  BOAT_SEAT_COUNT,
  SPEED_MULT_BLUE_ICE,
  SPEED_MULT_ICE,
  SPEED_MULT_LAND,
  SPEED_MULT_WATER,
} from './boat_physics';

describe('boat physics', () => {
  it('blue ice fastest', () => {
    expect(
      speedMultiplier({ surface: 'blue_ice', paddleLeft: false, paddleRight: false }),
    ).toBeGreaterThan(speedMultiplier({ surface: 'ice', paddleLeft: false, paddleRight: false }));
  });

  it('land slow', () => {
    expect(
      speedMultiplier({ surface: 'land', paddleLeft: false, paddleRight: false }),
    ).toBeLessThan(1);
  });

  it('one paddle turns', () => {
    expect(turnRate({ surface: 'water', paddleLeft: true, paddleRight: false })).toBe(-1);
    expect(turnRate({ surface: 'water', paddleLeft: false, paddleRight: true })).toBe(1);
  });

  it('both paddles forward', () => {
    expect(thrust({ surface: 'water', paddleLeft: true, paddleRight: true })).toBe(1);
  });

  it('no paddles no thrust', () => {
    expect(thrust({ surface: 'water', paddleLeft: false, paddleRight: false })).toBe(0);
  });

  it('2 seats', () => {
    expect(BOAT_SEAT_COUNT).toBe(2);
  });

  it('wiki ratios (water 8 / ice 40 / blue_ice 72.72 / land 2 blocks/s)', () => {
    expect(SPEED_MULT_WATER).toBe(1.0);
    expect(SPEED_MULT_ICE).toBe(5.0);
    expect(SPEED_MULT_BLUE_ICE).toBeCloseTo(9.09, 2);
    expect(SPEED_MULT_LAND).toBe(0.25);
  });
});
