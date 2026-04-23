import { describe, it, expect } from 'vitest';
import { MINING_LEVEL, BREAK_SPEED, DURABILITY, canMine, requiredLevelFor } from './tool_tier';

describe('tool tier', () => {
  it('iron mines diamond', () => {
    expect(canMine(MINING_LEVEL.iron, requiredLevelFor('diamond_ore'))).toBe(true);
  });

  it('stone cannot mine diamond', () => {
    expect(canMine(MINING_LEVEL.stone, requiredLevelFor('diamond_ore'))).toBe(false);
  });

  it('wood cannot mine iron', () => {
    expect(canMine(MINING_LEVEL.wood, requiredLevelFor('iron_ore'))).toBe(false);
  });

  it('gold fastest break speed', () => {
    expect(BREAK_SPEED.gold).toBeGreaterThan(BREAK_SPEED.diamond);
  });

  it('netherite most durable', () => {
    expect(DURABILITY.netherite).toBeGreaterThan(DURABILITY.diamond);
  });

  it('obsidian requires diamond', () => {
    expect(requiredLevelFor('obsidian')).toBe(4);
  });
});
