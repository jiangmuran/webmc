import { describe, it, expect } from 'vitest';
import { canHarvest, miningTicks } from './tool_mining_speed';

describe('tool mining speed', () => {
  it('diamond can harvest obsidian (diamond tier)', () => {
    expect(canHarvest('diamond', 'diamond')).toBe(true);
  });

  it('stone pickaxe cannot harvest diamond ore', () => {
    expect(canHarvest('stone', 'iron')).toBe(false);
  });

  it('netherite above diamond', () => {
    expect(canHarvest('netherite', 'diamond')).toBe(true);
  });

  it('hand slower than tool', () => {
    const hand = miningTicks(3, 'hand', false, 0, 0, false, true);
    const tool = miningTicks(3, 'iron', true, 0, 0, false, true);
    expect(hand).toBeGreaterThan(tool);
  });

  it('efficiency helps', () => {
    const none = miningTicks(3, 'iron', true, 0, 0, false, true);
    const eff = miningTicks(3, 'iron', true, 3, 0, false, true);
    expect(eff).toBeLessThan(none);
  });

  it('haste helps', () => {
    const none = miningTicks(3, 'iron', true, 0, 0, false, true);
    const haste = miningTicks(3, 'iron', true, 0, 2, false, true);
    expect(haste).toBeLessThanOrEqual(none);
  });

  it('underwater slower', () => {
    const dry = miningTicks(3, 'iron', true, 0, 0, false, true);
    const wet = miningTicks(3, 'iron', true, 0, 0, true, true);
    expect(wet).toBeGreaterThan(dry);
  });

  it('airborne slower', () => {
    const grounded = miningTicks(3, 'iron', true, 0, 0, false, true);
    const airborne = miningTicks(3, 'iron', true, 0, 0, false, false);
    expect(airborne).toBeGreaterThan(grounded);
  });
});
