import { describe, it, expect } from 'vitest';
import { speedMultiplier, turnRate, thrust, BOAT_SEAT_COUNT } from './boat_physics';

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
});
