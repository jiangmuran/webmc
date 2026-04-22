import { describe, it, expect } from 'vitest';
import { disenchant, grindRepair, isCurse } from './grind_enchant_xp';

describe('grindstone disenchant', () => {
  it('strips regular enchants, drops XP', () => {
    const r = disenchant({
      enchants: [{ id: 'sharpness', level: 3 }],
      rng: () => 0.5,
    });
    expect(r.xpDropped).toBeGreaterThan(0);
    expect(r.remainingEnchants.length).toBe(0);
  });

  it('curses remain', () => {
    const r = disenchant({
      enchants: [
        { id: 'sharpness', level: 3 },
        { id: 'curse_of_binding', level: 1 },
      ],
      rng: () => 0.5,
    });
    expect(r.remainingEnchants.map((e) => e.id)).toContain('curse_of_binding');
  });

  it('only curses = 0 XP', () => {
    const r = disenchant({
      enchants: [{ id: 'curse_of_vanishing', level: 1 }],
      rng: () => 0.5,
    });
    expect(r.xpDropped).toBe(0);
  });
});

describe('grind repair', () => {
  it('sums durability + bonus', () => {
    const r = grindRepair({
      leftCurrentDurability: 100,
      rightCurrentDurability: 100,
      maxDurability: 1561,
    });
    expect(r).toBeGreaterThan(200);
  });

  it('caps at max', () => {
    const r = grindRepair({
      leftCurrentDurability: 1500,
      rightCurrentDurability: 1500,
      maxDurability: 1561,
    });
    expect(r).toBe(1561);
  });
});

describe('isCurse', () => {
  it('detects curses', () => {
    expect(isCurse('curse_of_vanishing')).toBe(true);
    expect(isCurse('sharpness')).toBe(false);
  });
});
