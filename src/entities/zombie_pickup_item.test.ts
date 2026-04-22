import { describe, it, expect } from 'vitest';
import { computeDrops, makeEquipment, tryPickup } from './zombie_pickup_item';

describe('zombie equipment', () => {
  it('picks up diamond helmet over nothing', () => {
    const eq = makeEquipment();
    const r = tryPickup({
      equipment: eq,
      candidate: {
        item: 'webmc:diamond_helmet',
        category: 'armor',
        tier: 4,
        slot: 'helmet',
      },
      roll: 0.01,
    });
    expect(r.picked).toBe(true);
    expect(eq.helmet).toBe('webmc:diamond_helmet');
    expect(eq.dropChance.helmet).toBe(1);
  });

  it('refuses lower-tier replacement', () => {
    const eq = makeEquipment();
    eq.chest = 'webmc:diamond_chestplate';
    const r = tryPickup({
      equipment: eq,
      candidate: {
        item: 'webmc:iron_chestplate',
        category: 'armor',
        tier: 3,
        slot: 'chest',
      },
      roll: 0.01,
    });
    expect(r.picked).toBe(false);
  });

  it('replaces better item; returns the old', () => {
    const eq = makeEquipment();
    eq.mainhand = 'webmc:iron_sword';
    const r = tryPickup({
      equipment: eq,
      candidate: {
        item: 'webmc:diamond_sword',
        category: 'weapon',
        tier: 4,
        slot: 'mainhand',
      },
      roll: 0.01,
    });
    expect(r.picked).toBe(true);
    expect(r.replacedItem).toBe('webmc:iron_sword');
  });

  it('picked items always drop', () => {
    const eq = makeEquipment();
    eq.helmet = 'webmc:diamond_helmet';
    eq.dropChance.helmet = 1;
    const drops = computeDrops(eq, () => 0.5);
    expect(drops).toContain('webmc:diamond_helmet');
  });

  it('natural items rarely drop', () => {
    const eq = makeEquipment();
    eq.mainhand = 'webmc:iron_sword';
    const drops = computeDrops(eq, () => 0.5);
    expect(drops.length).toBe(0);
  });
});
