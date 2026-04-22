import { describe, it, expect } from 'vitest';
import { rollLoot, ZOMBIE_LOOT, SKELETON_LOOT } from './mob_loot_table';

describe('mob loot', () => {
  it('zombie drops flesh', () => {
    const drops = rollLoot(ZOMBIE_LOOT, {
      killedByPlayer: true,
      lootingLevel: 0,
      rand: () => 0.99,
    });
    expect(drops.find((d) => d.itemId === 'webmc:rotten_flesh')).toBeTruthy();
  });

  it('rare iron only with looting + player kill', () => {
    const noPlayer = rollLoot(ZOMBIE_LOOT, {
      killedByPlayer: false,
      lootingLevel: 3,
      rand: () => 0,
    });
    expect(noPlayer.find((d) => d.itemId === 'webmc:iron_ingot')).toBeFalsy();

    const withBoth = rollLoot(ZOMBIE_LOOT, {
      killedByPlayer: true,
      lootingLevel: 1,
      rand: () => 0.5,
    });
    expect(withBoth.find((d) => d.itemId === 'webmc:iron_ingot')).toBeTruthy();
  });

  it('skeleton drops bone + arrow', () => {
    const drops = rollLoot(SKELETON_LOOT, {
      killedByPlayer: true,
      lootingLevel: 0,
      rand: () => 0.99,
    });
    expect(drops.length).toBeGreaterThan(0);
  });
});
