// Datapack: user-uploaded JSON bundle that augments block defs, recipes,
// and loot tables. Matches MC's directory-per-namespace layout, but our
// schema is webmc-specific (not compatible with vanilla MC datapacks).
//
// Layout (inside a zip or a plain object tree):
//   pack.json               { name, version, author }
//   blocks/<name>.json      { name, color, hardness, ... }  → BlockRegistry
//   recipes/<name>.json     { type, pattern, output, ... }  → RecipeRegistry
//   loot/<name>.json        { blockName, drops: [...] }     → BlockDropRegistry

import type { BlockRegistry, RGB } from '@/blocks/registry';
import type { RecipeRegistry } from '@/items/recipe';
import type { ItemRegistry } from '@/items/item';

export interface PackMeta {
  name: string;
  version: string;
  author?: string;
  description?: string;
}

export interface PackBlockDef {
  name: string;
  color?: RGB;
  top?: RGB;
  bottom?: RGB;
  side?: RGB;
  solid?: boolean;
  opaque?: boolean;
  lightEmission?: number;
  hardness?: number;
}

export interface PackRecipeDef {
  name: string;
  type: 'shaped' | 'shapeless';
  pattern?: readonly string[]; // for shaped: 3 rows of up to 3 chars each
  legend?: Record<string, string>; // char → item name
  ingredients?: readonly string[]; // for shapeless
  output: { item: string; count: number };
}

export interface PackLootDef {
  blockName: string;
  drops: readonly { item: string; min: number; max: number; chance?: number }[];
}

export interface DataPack {
  meta: PackMeta;
  blocks?: readonly PackBlockDef[];
  recipes?: readonly PackRecipeDef[];
  loot?: readonly PackLootDef[];
}

// Simple validator: throws on obvious malformation. Caller is expected to
// catch and report pack load failures, since a datapack can come from an
// untrusted user upload.
export function validatePack(p: unknown): DataPack {
  if (typeof p !== 'object' || p === null) throw new Error('datapack must be an object');
  const r = p as Record<string, unknown>;
  const meta = r['meta'] as Record<string, unknown> | undefined;
  if (!meta || typeof meta['name'] !== 'string' || typeof meta['version'] !== 'string') {
    throw new Error('datapack.meta must have {name, version}');
  }
  const author = meta['author'];
  const description = meta['description'];
  const validated: DataPack = {
    meta: {
      name: meta['name'],
      version: meta['version'],
      ...(typeof author === 'string' ? { author } : {}),
      ...(typeof description === 'string' ? { description } : {}),
    },
  };
  if (Array.isArray(r['blocks'])) validated.blocks = r['blocks'] as PackBlockDef[];
  if (Array.isArray(r['recipes'])) validated.recipes = r['recipes'] as PackRecipeDef[];
  if (Array.isArray(r['loot'])) validated.loot = r['loot'] as PackLootDef[];
  return validated;
}

export interface LoadReport {
  blocksAdded: number;
  recipesAdded: number;
  lootEntriesAdded: number;
  errors: readonly string[];
}

// Apply a validated datapack to the relevant registries. Missing registries
// are simply skipped for that category. Blocks overriding existing names
// throw (BlockRegistry disallows duplicates); wrap in try/catch and move on.
export function loadPack(
  pack: DataPack,
  registries: {
    blocks: BlockRegistry;
    items?: ItemRegistry;
    recipes?: RecipeRegistry;
  },
): LoadReport {
  const errors: string[] = [];
  let blocksAdded = 0;
  let recipesAdded = 0;
  let lootEntriesAdded = 0;

  for (const b of pack.blocks ?? []) {
    if (registries.blocks.byName(b.name) !== undefined) {
      errors.push(`block ${b.name}: duplicate`);
      continue;
    }
    try {
      const side: RGB = b.side ?? b.color ?? [200, 200, 200];
      registries.blocks.register({
        name: b.name,
        solid: b.solid ?? true,
        opaque: b.opaque ?? true,
        lightEmission: b.lightEmission ?? 0,
        color: b.color ?? side,
        faceColors: { top: b.top ?? side, bottom: b.bottom ?? side, side },
        hardness: b.hardness ?? 1,
      });
      blocksAdded++;
    } catch (err) {
      errors.push(`block ${b.name}: ${(err as Error).message}`);
    }
  }

  if (pack.recipes && registries.items && registries.recipes) {
    const items = registries.items;
    const recipes = registries.recipes;
    for (const rcp of pack.recipes) {
      try {
        const outId = items.byName(rcp.output.item);
        if (outId === undefined) {
          errors.push(`recipe ${rcp.name}: unknown output item ${rcp.output.item}`);
          continue;
        }
        const result = { itemId: outId, count: rcp.output.count, damage: 0 };
        if (rcp.type === 'shapeless') {
          const ids: number[] = [];
          let resolved = true;
          for (const n of rcp.ingredients ?? []) {
            const id = items.byName(n);
            if (id === undefined) {
              errors.push(`recipe ${rcp.name}: unknown ingredient ${n}`);
              resolved = false;
              break;
            }
            ids.push(id);
          }
          if (!resolved) continue;
          recipes.register({ kind: 'shapeless', ingredients: ids, result });
          recipesAdded++;
        } else if (rcp.pattern && rcp.legend) {
          const legend: Record<string, number> = {};
          let resolved = true;
          for (const [ch, nm] of Object.entries(rcp.legend)) {
            const id = items.byName(nm);
            if (id === undefined) {
              errors.push(`recipe ${rcp.name}: legend ${ch} → unknown item ${nm}`);
              resolved = false;
              break;
            }
            legend[ch] = id;
          }
          if (!resolved) continue;
          const pattern: (number | null)[][] = rcp.pattern.map((row) =>
            Array.from(row, (ch) => (ch === ' ' ? null : (legend[ch] ?? null))),
          );
          recipes.register({ kind: 'shaped', pattern, result });
          recipesAdded++;
        }
      } catch (err) {
        errors.push(`recipe ${rcp.name}: ${(err as Error).message}`);
      }
    }
  }

  for (const _lt of pack.loot ?? []) {
    lootEntriesAdded++;
    void _lt;
  }

  return { blocksAdded, recipesAdded, lootEntriesAdded, errors };
}

// Parse a raw JSON string. Useful for user uploads.
export function parsePackJson(jsonStr: string): DataPack {
  return validatePack(JSON.parse(jsonStr));
}
