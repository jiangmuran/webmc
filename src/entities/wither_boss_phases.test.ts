import { describe, it, expect } from 'vitest';
import {
  phase,
  immuneToProjectile,
  canBreakBlocks,
  regenFromDrinkingMilk,
  WITHER_MAX_HEALTH,
} from './wither_boss_phases';

describe('wither boss phases', () => {
  it('full hp phase 1', () => {
    expect(phase({ health: WITHER_MAX_HEALTH, maxHealth: WITHER_MAX_HEALTH })).toBe(1);
  });

  it('half hp phase 2', () => {
    expect(phase({ health: WITHER_MAX_HEALTH / 2, maxHealth: WITHER_MAX_HEALTH })).toBe(2);
  });

  it('projectile immune in phase 2', () => {
    expect(immuneToProjectile({ health: 100, maxHealth: WITHER_MAX_HEALTH })).toBe(true);
  });

  it('breaks blocks in phase 2', () => {
    expect(canBreakBlocks({ health: 50, maxHealth: WITHER_MAX_HEALTH })).toBe(true);
  });

  it('milk irrelevant', () => {
    expect(regenFromDrinkingMilk({ health: 300, maxHealth: 300 })).toBe(false);
  });
});
