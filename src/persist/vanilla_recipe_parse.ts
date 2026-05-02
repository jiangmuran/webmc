// Parse a vanilla recipe JSON. Covers crafting_shaped, crafting_shapeless,
// smelting/blasting/smoking/campfire_cooking. Item names are normalized
// to webmc namespaces via mapVanillaItemName so the result can be fed
// straight into the webmc recipe registry.
//
// Source: minecraft.wiki "Recipe". Behavioral spec — clean-room.

import { mapVanillaItemName } from './vanilla_item_map';

export type RecipeType =
  | 'crafting_shaped'
  | 'crafting_shapeless'
  | 'smelting'
  | 'blasting'
  | 'smoking'
  | 'campfire_cooking';

export interface ShapedRecipe {
  type: 'crafting_shaped';
  pattern: string[];
  key: Record<string, string[]>; // Each key maps to one or more accepted item names.
  resultItem: string;
  resultCount: number;
}

export interface ShapelessRecipe {
  type: 'crafting_shapeless';
  ingredients: string[][]; // Each slot is a list of acceptable item names.
  resultItem: string;
  resultCount: number;
}

export interface CookingRecipe {
  type: 'smelting' | 'blasting' | 'smoking' | 'campfire_cooking';
  ingredient: string[];
  resultItem: string;
  experience: number;
  cookingTime: number;
}

export type ParsedRecipe = ShapedRecipe | ShapelessRecipe | CookingRecipe;

export class RecipeParseError extends Error {}

function namesFromIngredient(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (typeof value === 'string') return [mapVanillaItemName(value)];
  if (Array.isArray(value)) {
    const out: string[] = [];
    for (const v of value) out.push(...namesFromIngredient(v));
    return out;
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj['item'] === 'string') return [mapVanillaItemName(obj['item'])];
    if (typeof obj['tag'] === 'string') return [`#${mapVanillaItemName(obj['tag'])}`];
  }
  return [];
}

function readResult(value: unknown): { name: string; count: number } {
  if (typeof value === 'string') return { name: mapVanillaItemName(value), count: 1 };
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    const name =
      typeof obj['item'] === 'string'
        ? obj['item']
        : typeof obj['id'] === 'string'
          ? obj['id']
          : '';
    const count =
      typeof obj['count'] === 'number'
        ? obj['count']
        : typeof obj['Count'] === 'number'
          ? obj['Count']
          : 1;
    return { name: name ? mapVanillaItemName(name) : '', count: Math.max(1, Math.trunc(count)) };
  }
  return { name: '', count: 1 };
}

function stripNamespace(s: string): RecipeType | null {
  const local = s.replace(/^minecraft:/, '');
  const known: ReadonlyArray<RecipeType> = [
    'crafting_shaped',
    'crafting_shapeless',
    'smelting',
    'blasting',
    'smoking',
    'campfire_cooking',
  ];
  return (known as readonly string[]).includes(local) ? (local as RecipeType) : null;
}

export function parseVanillaRecipe(text: string): ParsedRecipe {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new RecipeParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null) throw new RecipeParseError('not an object');
  const obj = json as Record<string, unknown>;
  const typeStr = typeof obj['type'] === 'string' ? obj['type'] : '';
  const type = stripNamespace(typeStr);
  if (!type) throw new RecipeParseError(`unsupported recipe type "${typeStr}"`);
  const result = readResult(obj['result']);
  if (!result.name) throw new RecipeParseError('missing/invalid result');

  if (type === 'crafting_shaped') {
    const patternRaw = obj['pattern'];
    if (!Array.isArray(patternRaw)) throw new RecipeParseError('shaped: missing pattern');
    const pattern = patternRaw.map((row) => (typeof row === 'string' ? row : ''));
    const keyRaw = obj['key'];
    const key: Record<string, string[]> = {};
    if (typeof keyRaw === 'object' && keyRaw !== null) {
      for (const [k, v] of Object.entries(keyRaw)) {
        key[k] = namesFromIngredient(v);
      }
    }
    return {
      type: 'crafting_shaped',
      pattern,
      key,
      resultItem: result.name,
      resultCount: result.count,
    };
  }
  if (type === 'crafting_shapeless') {
    const raw = obj['ingredients'];
    const ingredients: string[][] = [];
    if (Array.isArray(raw)) for (const v of raw) ingredients.push(namesFromIngredient(v));
    return {
      type: 'crafting_shapeless',
      ingredients,
      resultItem: result.name,
      resultCount: result.count,
    };
  }
  // Cooking variants share schema.
  const ingredient = namesFromIngredient(obj['ingredient']);
  const experience = typeof obj['experience'] === 'number' ? obj['experience'] : 0;
  const cookingTime = typeof obj['cookingtime'] === 'number' ? obj['cookingtime'] : 200;
  return {
    type,
    ingredient,
    resultItem: result.name,
    experience,
    cookingTime,
  };
}
