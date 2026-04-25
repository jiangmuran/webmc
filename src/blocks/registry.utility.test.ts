import { describe, it, expect } from 'vitest';
import { createDefaultRegistry } from './registry';

describe('default registry — utility station blocks', () => {
  const r = createDefaultRegistry();
  const utilityBlocks = [
    'webmc:furnace',
    'webmc:smoker',
    'webmc:blast_furnace',
    'webmc:cauldron',
    'webmc:brewing_stand',
    'webmc:crafter',
    'webmc:heavy_core',
    'webmc:crafting_table',
  ];

  it('every utility station resolves by name', () => {
    for (const n of utilityBlocks) {
      expect(r.byName(n), `missing ${n}`).toBeDefined();
    }
  });

  it('cauldron is non-opaque', () => {
    const id = r.byName('webmc:cauldron');
    expect(id).toBeDefined();
    if (id === undefined) return;
    expect(r.get(id).opaque).toBe(false);
  });

  it('heavy_core is unbreakable (hardness < 0)', () => {
    const id = r.byName('webmc:heavy_core');
    expect(id).toBeDefined();
    if (id === undefined) return;
    expect(r.get(id).hardness).toBeLessThan(0);
  });
});
