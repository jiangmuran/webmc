import { describe, it, expect } from 'vitest';
import {
  stepFall,
  elytraGlideVY,
  featherFallStep,
  TERMINAL_FALL_VY,
  GRAVITY,
} from './terminal_velocity';

describe('terminal velocity', () => {
  it('falls faster each tick', () => {
    let vy = 0;
    for (let i = 0; i < 5; i++) vy = stepFall(vy);
    expect(vy).toBeLessThan(GRAVITY);
  });

  it('clamps at terminal', () => {
    let vy = -10;
    for (let i = 0; i < 100; i++) vy = stepFall(vy);
    expect(vy).toBeGreaterThanOrEqual(TERMINAL_FALL_VY);
  });

  it('elytra at steep pitch drops slower than gravity alone', () => {
    const elytra = elytraGlideVY(-1, Math.PI / 2);
    const normal = stepFall(-1);
    expect(elytra).toBeGreaterThan(normal);
  });

  it('feather falling softens floor', () => {
    expect(featherFallStep(-10, 4)).toBeGreaterThan(TERMINAL_FALL_VY);
  });
});
