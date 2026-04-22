import { describe, it, expect } from 'vitest';
import {
  speedBonus,
  toolSpeedWith,
  requiresCorrectTool,
  applyHaste,
  applyMiningFatigue,
} from './efficiency_speed';

describe('efficiency speed', () => {
  it('no level no bonus', () => {
    expect(speedBonus(0)).toBe(0);
  });

  it('level 5 = 26', () => {
    expect(speedBonus(5)).toBe(26);
  });

  it('tool speed combines', () => {
    expect(toolSpeedWith(8, 4)).toBe(8 + 17);
  });

  it('pickaxe correct for stone', () => {
    expect(requiresCorrectTool('stone', 'pickaxe')).toBe(true);
    expect(requiresCorrectTool('stone', 'shovel')).toBe(false);
  });

  it('haste +20% per level', () => {
    expect(applyHaste(10, 2)).toBeCloseTo(14);
  });

  it('fatigue drastically slows', () => {
    expect(applyMiningFatigue(10, 3)).toBeCloseTo(0.027);
  });
});
