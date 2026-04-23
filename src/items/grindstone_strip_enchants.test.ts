import { describe, it, expect } from 'vitest';
import { grind, combineTwoRepair, type Tool } from './grindstone_strip_enchants';

const tool: Tool = {
  enchants: [
    { id: 'sharpness', level: 3 },
    { id: 'curse_of_binding', level: 1 },
  ],
  priorWorkPenalty: 5,
  damage: 500,
  maxDurability: 1000,
};

describe('grindstone strip enchants', () => {
  it('strips non-curses', () => {
    const r = grind(tool);
    expect(r.result.enchants.map((e) => e.id)).toEqual(['curse_of_binding']);
  });

  it('xp dropped from stripped', () => {
    expect(grind(tool).xpDropped).toBeGreaterThan(0);
  });

  it('clears prior work penalty', () => {
    expect(grind(tool).result.priorWorkPenalty).toBe(0);
  });

  it('repairs some durability', () => {
    expect(grind(tool).result.damage).toBeLessThan(tool.damage);
  });

  it('combine repair with bonus', () => {
    const b: Tool = { ...tool, damage: 700 };
    const combined = combineTwoRepair(tool, b);
    expect(combined.damage).toBeLessThan(tool.damage);
  });
});
