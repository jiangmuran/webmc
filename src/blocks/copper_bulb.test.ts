import { describe, it, expect } from 'vitest';
import {
  lightEmission,
  makeCopperBulb,
  oxidizeOneStage,
  updatePower,
  waxCopperBulb,
} from './copper_bulb';

describe('copper bulb', () => {
  it('toggles on rising edge only', () => {
    const b = makeCopperBulb();
    expect(updatePower(b, 0)).toBe(false);
    expect(b.lit).toBe(false);
    expect(updatePower(b, 5)).toBe(true);
    expect(b.lit).toBe(true);
    // Sustained high — no rising edge.
    expect(updatePower(b, 5)).toBe(false);
    expect(b.lit).toBe(true);
    expect(updatePower(b, 0)).toBe(false); // falling edge ≠ toggle
    expect(updatePower(b, 10)).toBe(true);
    expect(b.lit).toBe(false);
  });

  it('unoxidized + lit emits 15', () => {
    const b = makeCopperBulb();
    b.lit = true;
    expect(lightEmission(b)).toBe(15);
  });

  it('oxidized + lit emits 4', () => {
    const b = makeCopperBulb();
    b.lit = true;
    oxidizeOneStage(b);
    oxidizeOneStage(b);
    oxidizeOneStage(b);
    expect(lightEmission(b)).toBe(4);
  });

  it('waxed bulb refuses further oxidation', () => {
    const b = makeCopperBulb();
    waxCopperBulb(b);
    expect(oxidizeOneStage(b)).toBe(false);
  });

  it('unlit bulb emits 0 regardless of stage', () => {
    const b = makeCopperBulb();
    expect(lightEmission(b)).toBe(0);
  });
});
