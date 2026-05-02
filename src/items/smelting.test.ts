import { describe, it, expect } from 'vitest';
import { SMELTING_RECIPES, findRecipe, fuelBurnTime, makeFurnace, tickFurnace } from './smelting';

const NAMES = [
  'webmc:raw_beef',
  'webmc:cooked_beef',
  'webmc:iron_ore',
  'webmc:iron_ingot',
  'webmc:gold_ore',
  'webmc:gold_ingot',
  'webmc:coal',
  'webmc:sand',
  'webmc:glass',
];

function ctx(): Parameters<typeof tickFurnace>[2] {
  const ids = new Map(NAMES.map((n, i) => [n, i + 1]));
  const byId = new Map(Array.from(ids, ([n, id]) => [id, n]));
  return {
    itemName: (id) => byId.get(id) ?? 'webmc:unknown',
    itemId: (n) => ids.get(n),
    maxStack: () => 64,
  };
}
function idOf(ctxv: ReturnType<typeof ctx>, name: string): number {
  const id = ctxv.itemId(name);
  if (id === undefined) throw new Error(`missing ${name}`);
  return id;
}

describe('smelting', () => {
  it('has 15+ recipes', () => {
    expect(SMELTING_RECIPES.length).toBeGreaterThanOrEqual(15);
  });

  it('findRecipe cooks iron_ore → iron_ingot', () => {
    const r = findRecipe('webmc:iron_ore');
    expect(r?.output).toBe('webmc:iron_ingot');
  });

  it('fuelBurnTime — coal burns 80s, stick 5s, unknown 0s', () => {
    expect(fuelBurnTime('webmc:coal')).toBe(80);
    expect(fuelBurnTime('webmc:stick')).toBe(5);
    expect(fuelBurnTime('webmc:dirt')).toBe(0);
  });

  it('tickFurnace cooks a raw_beef given enough time and coal', () => {
    const c = ctx();
    const f = makeFurnace();
    f.input = { itemId: idOf(c, 'webmc:raw_beef'), count: 1, damage: 0 };
    f.fuel = { itemId: idOf(c, 'webmc:coal'), count: 1, damage: 0 };
    let completed = false;
    for (let i = 0; i < 500; i++) {
      if (tickFurnace(f, 0.05, c)) completed = true;
    }
    expect(completed).toBe(true);
    expect(f.output?.itemId).toBe(idOf(c, 'webmc:cooked_beef'));
    expect(f.input).toBeNull();
  });

  it('tickFurnace refuses when no fuel', () => {
    const c = ctx();
    const f = makeFurnace();
    f.input = { itemId: idOf(c, 'webmc:raw_beef'), count: 1, damage: 0 };
    for (let i = 0; i < 300; i++) tickFurnace(f, 0.1, c);
    expect(f.output).toBeNull();
  });

  it('tickFurnace refuses when output slot contains different item', () => {
    const c = ctx();
    const f = makeFurnace();
    f.input = { itemId: idOf(c, 'webmc:raw_beef'), count: 1, damage: 0 };
    f.fuel = { itemId: idOf(c, 'webmc:coal'), count: 1, damage: 0 };
    f.output = { itemId: idOf(c, 'webmc:iron_ingot'), count: 1, damage: 0 };
    for (let i = 0; i < 300; i++) tickFurnace(f, 0.1, c);
    expect(f.input).not.toBeNull();
  });

  it('Java canonical raw meat IDs (no raw_ prefix) also smelt (wiki)', () => {
    // Wiki minecraft.wiki/w/Smelting: Java item IDs are `beef`,
    // `chicken`, etc. — no `raw_` prefix. Registry has both spellings;
    // smelting must accept both.
    expect(findRecipe('webmc:beef')?.output).toBe('webmc:cooked_beef');
    expect(findRecipe('webmc:chicken')?.output).toBe('webmc:cooked_chicken');
    expect(findRecipe('webmc:porkchop')?.output).toBe('webmc:cooked_porkchop');
    expect(findRecipe('webmc:mutton')?.output).toBe('webmc:cooked_mutton');
    expect(findRecipe('webmc:rabbit')?.output).toBe('webmc:cooked_rabbit');
  });
});
