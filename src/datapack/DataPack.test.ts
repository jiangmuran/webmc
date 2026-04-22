import { describe, it, expect } from 'vitest';
import { createDefaultRegistry } from '@/blocks/registry';
import { ItemRegistry } from '@/items/item';
import { RecipeRegistry } from '@/items/recipe';
import { loadPack, parsePackJson, validatePack } from './DataPack';

function stubItems(): ItemRegistry {
  const r = new ItemRegistry();
  r.register({ name: 'webmc:stick', maxStack: 64, durability: 0 });
  r.register({ name: 'webmc:oak_planks', maxStack: 64, durability: 0 });
  r.register({ name: 'webmc:iron_ingot', maxStack: 64, durability: 0 });
  r.register({ name: 'webmc:new_rod', maxStack: 64, durability: 0 });
  return r;
}

describe('DataPack', () => {
  it('validatePack rejects malformed input', () => {
    expect(() => validatePack(null)).toThrow();
    expect(() => validatePack({})).toThrow();
    expect(() => validatePack({ meta: { name: 'x' } })).toThrow();
  });

  it('validatePack keeps meta + optional sections', () => {
    const p = validatePack({
      meta: { name: 'pack', version: '1' },
      blocks: [{ name: 'webmc:test' }],
    });
    expect(p.meta.name).toBe('pack');
    expect(p.blocks).toHaveLength(1);
  });

  it('loadPack registers new blocks', () => {
    const blocks = createDefaultRegistry();
    const before = blocks.size;
    const report = loadPack(
      {
        meta: { name: 'p', version: '1' },
        blocks: [
          { name: 'webmc:marble', color: [255, 255, 255], hardness: 1 },
          { name: 'webmc:slate', color: [40, 40, 40], hardness: 2 },
        ],
      },
      { blocks },
    );
    expect(report.blocksAdded).toBe(2);
    expect(blocks.size).toBe(before + 2);
    expect(report.errors).toHaveLength(0);
  });

  it('loadPack reports duplicate-block errors without throwing', () => {
    const blocks = createDefaultRegistry();
    const report = loadPack(
      {
        meta: { name: 'p', version: '1' },
        blocks: [{ name: 'webmc:stone' }], // already registered in default registry
      },
      { blocks },
    );
    expect(report.blocksAdded).toBe(0);
    expect(report.errors[0]).toMatch(/duplicate/i);
  });

  it('loadPack registers shapeless recipe', () => {
    const blocks = createDefaultRegistry();
    const items = stubItems();
    const recipes = new RecipeRegistry();
    const report = loadPack(
      {
        meta: { name: 'p', version: '1' },
        recipes: [
          {
            name: 'rod',
            type: 'shapeless',
            ingredients: ['webmc:stick', 'webmc:iron_ingot'],
            output: { item: 'webmc:new_rod', count: 1 },
          },
        ],
      },
      { blocks, items, recipes },
    );
    expect(report.recipesAdded).toBe(1);
    expect(recipes.all()).toHaveLength(1);
  });

  it('loadPack registers shaped recipe with legend', () => {
    const blocks = createDefaultRegistry();
    const items = stubItems();
    const recipes = new RecipeRegistry();
    const report = loadPack(
      {
        meta: { name: 'p', version: '1' },
        recipes: [
          {
            name: 'rod',
            type: 'shaped',
            pattern: ['I', 'I', 'S'],
            legend: { I: 'webmc:iron_ingot', S: 'webmc:stick' },
            output: { item: 'webmc:new_rod', count: 1 },
          },
        ],
      },
      { blocks, items, recipes },
    );
    expect(report.recipesAdded).toBe(1);
  });

  it('parsePackJson parses + validates', () => {
    const json = JSON.stringify({
      meta: { name: 'parsed', version: '1' },
      blocks: [{ name: 'webmc:clay' }],
    });
    const p = parsePackJson(json);
    expect(p.meta.name).toBe('parsed');
    expect(p.blocks).toHaveLength(1);
  });
});
