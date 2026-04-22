import { describe, it, expect } from 'vitest';
import { witchHutLayout, witchIsInsideHome } from './witch_hut';

describe('witch hut', () => {
  it('has 4 stilts and persistent witch', () => {
    const l = witchHutLayout({ x: 0, y: 60, z: 0 });
    expect(l.stiltCount).toBe(4);
    expect(l.persistentWitch).toBe(true);
  });

  it('interior includes cauldron and crafting table', () => {
    const l = witchHutLayout({ x: 0, y: 60, z: 0 });
    const blocks = l.interior.map((b) => b.block);
    expect(blocks).toContain('webmc:cauldron');
    expect(blocks).toContain('webmc:crafting_table');
  });

  it('witch in AABB = persistent', () => {
    expect(witchIsInsideHome({ x: 3, y: 62, z: 3 }, { x: 0, y: 60, z: 0 })).toBe(true);
  });

  it('witch 20 blocks away = not persistent', () => {
    expect(witchIsInsideHome({ x: 20, y: 62, z: 3 }, { x: 0, y: 60, z: 0 })).toBe(false);
  });
});
