import { describe, it, expect } from 'vitest';
import {
  intervalFor,
  canRegen,
  shouldHealThisTick,
  exhaustionAfterHeal,
  FAST_REGEN_TICK_INTERVAL,
  REGEN_TICK_INTERVAL,
  PEACEFUL_REGEN_TICK_INTERVAL,
  type RegenInput,
} from './player_natural_regen';

const hungry: RegenInput = {
  food: 10,
  saturation: 0,
  health: 10,
  maxHealth: 20,
  ticksSinceLastRegen: 200,
  peacefulDifficulty: false,
};

describe('player natural regen', () => {
  it('fast regen interval with full food + saturation', () => {
    const i: RegenInput = { ...hungry, food: 20, saturation: 5 };
    expect(intervalFor(i)).toBe(FAST_REGEN_TICK_INTERVAL);
  });

  it('slow regen default', () => {
    expect(intervalFor({ ...hungry, food: 18 })).toBe(REGEN_TICK_INTERVAL);
  });

  it('peaceful always regens', () => {
    expect(intervalFor({ ...hungry, peacefulDifficulty: true })).toBe(PEACEFUL_REGEN_TICK_INTERVAL);
  });

  it('max HP no regen', () => {
    expect(canRegen({ ...hungry, food: 20, health: hungry.maxHealth })).toBe(false);
  });

  it('low food no regen', () => {
    expect(canRegen(hungry)).toBe(false);
  });

  it('peaceful regens below max', () => {
    expect(canRegen({ ...hungry, peacefulDifficulty: true })).toBe(true);
  });

  it('heals when interval lapsed', () => {
    expect(shouldHealThisTick({ ...hungry, food: 20, saturation: 5 })).toBe(true);
  });

  it('costs exhaustion on heal', () => {
    expect(exhaustionAfterHeal({ ...hungry, food: 20, saturation: 5 })).toBeGreaterThan(0);
  });
});
