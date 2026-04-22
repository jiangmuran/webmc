import { describe, it, expect } from 'vitest';
import { SPAWN_EGGS, mobKindFromEgg, spawnEggFor } from './spawn_egg';
import { MOB_DEFS } from '@/entities/mob';

describe('spawn eggs', () => {
  it('all spawn eggs resolve to a registered mob kind', () => {
    for (const egg of SPAWN_EGGS) {
      expect(MOB_DEFS[egg.mobKind]).toBeDefined();
    }
  });

  it('spawnEggFor returns null for unknown name', () => {
    expect(spawnEggFor('webmc:potato_spawn_egg')).toBeNull();
  });

  it('mobKindFromEgg maps names correctly', () => {
    expect(mobKindFromEgg('webmc:zombie_spawn_egg')).toBe('zombie');
    expect(mobKindFromEgg('webmc:creeper_spawn_egg')).toBe('creeper');
    expect(mobKindFromEgg('webmc:warden_spawn_egg')).toBe('warden');
  });

  it('covers the expanded M18 roster', () => {
    const kinds = new Set(SPAWN_EGGS.map((e) => e.mobKind));
    for (const k of ['pig', 'cow', 'warden', 'axolotl', 'frog', 'bee']) {
      expect(kinds.has(k as never)).toBe(true);
    }
  });
});
