import { describe, it, expect } from 'vitest';
import { parseVanillaRecipe, RecipeParseError } from './vanilla_recipe_parse';

describe('vanilla recipe parser', () => {
  it('parses crafting_shaped with key dict', () => {
    const r = parseVanillaRecipe(
      JSON.stringify({
        type: 'minecraft:crafting_shaped',
        pattern: ['XX', 'X '],
        key: { X: { item: 'minecraft:stick' } },
        result: { item: 'minecraft:torch', count: 4 },
      }),
    );
    expect(r.type).toBe('crafting_shaped');
    if (r.type !== 'crafting_shaped') return;
    expect(r.pattern).toEqual(['XX', 'X ']);
    expect(r.key['X']).toEqual(['webmc:stick']);
    expect(r.resultItem).toBe('webmc:torch');
    expect(r.resultCount).toBe(4);
  });

  it('parses crafting_shapeless with array ingredients', () => {
    const r = parseVanillaRecipe(
      JSON.stringify({
        type: 'minecraft:crafting_shapeless',
        ingredients: [
          { item: 'minecraft:wheat' },
          [{ item: 'minecraft:wheat' }, { item: 'minecraft:hay_block' }],
        ],
        result: 'minecraft:bread',
      }),
    );
    expect(r.type).toBe('crafting_shapeless');
    if (r.type !== 'crafting_shapeless') return;
    expect(r.ingredients[0]).toEqual(['webmc:wheat']);
    expect(r.ingredients[1]).toEqual(['webmc:wheat', 'webmc:hay_block']);
    expect(r.resultItem).toBe('webmc:bread');
    expect(r.resultCount).toBe(1);
  });

  it('parses smelting with experience and cooking time', () => {
    const r = parseVanillaRecipe(
      JSON.stringify({
        type: 'minecraft:smelting',
        ingredient: { item: 'minecraft:iron_ore' },
        result: { item: 'minecraft:iron_ingot' },
        experience: 0.7,
        cookingtime: 200,
      }),
    );
    expect(r.type).toBe('smelting');
    if (r.type !== 'smelting') return;
    expect(r.ingredient).toEqual(['webmc:iron_ore']);
    expect(r.resultItem).toBe('webmc:iron_ingot');
    expect(r.experience).toBeCloseTo(0.7);
    expect(r.cookingTime).toBe(200);
  });

  it('rejects unsupported recipe type', () => {
    expect(() =>
      parseVanillaRecipe('{"type":"minecraft:soulcrafting","result":"minecraft:soul_lantern"}'),
    ).toThrow(RecipeParseError);
  });

  it('rejects missing result', () => {
    expect(() =>
      parseVanillaRecipe(
        JSON.stringify({
          type: 'minecraft:crafting_shaped',
          pattern: ['X'],
          key: { X: { item: 'minecraft:stick' } },
        }),
      ),
    ).toThrow(RecipeParseError);
  });

  it('handles tag references with # prefix', () => {
    const r = parseVanillaRecipe(
      JSON.stringify({
        type: 'minecraft:smelting',
        ingredient: { tag: 'minecraft:logs' },
        result: 'minecraft:charcoal',
      }),
    );
    expect(r.type).toBe('smelting');
    if (r.type !== 'smelting') return;
    expect(r.ingredient).toEqual(['#webmc:logs']);
  });
});
