import { describe, it, expect } from 'vitest';
import { planEndCity, rollEndCityLoot } from './end_city';

describe('end city', () => {
  it('has tower_base and tower_top', () => {
    const p = planEndCity({ rng: () => 0.1, towerHeight: 3 });
    expect(p.pieces[0]).toBe('tower_base');
    expect(p.pieces).toContain('tower_top');
  });

  it('ship provides elytra slot', () => {
    const p = planEndCity({ rng: () => 0.1, towerHeight: 1 }); // 0.1 < 0.5
    expect(p.hasShip).toBe(true);
    expect(p.elytraSlot).toBe(true);
  });

  it('no ship if roll > 0.5', () => {
    // need bridge roll < 0.6 then ship roll > 0.5
    let count = 0;
    const rng = () => {
      count++;
      if (count === 1) return 0.1; // bridge
      return 0.9; // ship
    };
    const p = planEndCity({ rng, towerHeight: 1 });
    expect(p.hasShip).toBe(false);
  });

  it('shulker count scales with tower height', () => {
    const short = planEndCity({ rng: () => 0.9, towerHeight: 1 });
    const tall = planEndCity({ rng: () => 0.9, towerHeight: 5 });
    expect(tall.shulkerCount).toBeGreaterThan(short.shulkerCount);
  });

  it('loot table rolls items', () => {
    const r = rollEndCityLoot(0.01);
    expect(r?.item).toBe('webmc:diamond_pickaxe');
  });
});
