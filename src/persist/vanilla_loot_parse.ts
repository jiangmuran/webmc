// Parse a vanilla loot table JSON (subset). Schema:
//   { "type": "minecraft:block", "pools": [
//       { "rolls": <int|range|object>, "entries": [
//         { "type": "minecraft:item", "name": "minecraft:cobblestone", "weight": <int=1> },
//         ...
//       ] },
//     ]
//   }
// Items inside "minecraft:tag" entries reference a tag (#-prefixed).
//
// Source: minecraft.wiki "Loot table". Behavioral spec — clean-room.

import { mapVanillaItemName } from './vanilla_item_map';

export interface LootEntry {
  type: 'item' | 'tag' | 'empty' | 'unknown';
  name: string; // webmc-namespaced, or '#webmc:name' for tags, or '' for empty.
  weight: number; // default 1
  // Optional set_count function range parsed from functions[].count (min, max).
  countMin: number;
  countMax: number;
}

export interface LootPool {
  rolls: { min: number; max: number };
  entries: LootEntry[];
}

export interface ParsedLootTable {
  type: string; // tail of the type identifier ("block", "chest", ...)
  pools: LootPool[];
}

export class LootParseError extends Error {}

function readRange(v: unknown): { min: number; max: number } {
  if (typeof v === 'number') return { min: Math.trunc(v), max: Math.trunc(v) };
  if (typeof v === 'object' && v !== null) {
    const o = v as Record<string, unknown>;
    const mn = typeof o['min'] === 'number' ? o['min'] : 0;
    const mx = typeof o['max'] === 'number' ? o['max'] : mn;
    return { min: Math.trunc(mn), max: Math.trunc(mx) };
  }
  return { min: 1, max: 1 };
}

function entryType(s: string): LootEntry['type'] {
  const local = s.replace(/^minecraft:/, '');
  if (local === 'item') return 'item';
  if (local === 'tag') return 'tag';
  if (local === 'empty') return 'empty';
  return 'unknown';
}

function readCountFromFunctions(funcsRaw: unknown): { min: number; max: number } {
  if (!Array.isArray(funcsRaw)) return { min: 1, max: 1 };
  for (const f of funcsRaw) {
    if (typeof f !== 'object' || f === null) continue;
    const fo = f as Record<string, unknown>;
    const fn = typeof fo['function'] === 'string' ? fo['function'] : '';
    if (fn === 'minecraft:set_count' || fn === 'set_count') {
      return readRange(fo['count']);
    }
  }
  return { min: 1, max: 1 };
}

export function parseVanillaLootTable(text: string): ParsedLootTable {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new LootParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new LootParseError('loot table must be an object');
  const obj = json as Record<string, unknown>;
  const typeStr = typeof obj['type'] === 'string' ? obj['type'] : 'minecraft:block';
  const type = typeStr.replace(/^minecraft:/, '');
  const poolsRaw = obj['pools'];
  const pools: LootPool[] = [];
  if (Array.isArray(poolsRaw)) {
    for (const p of poolsRaw) {
      if (typeof p !== 'object' || p === null) continue;
      const po = p as Record<string, unknown>;
      const rolls = readRange(po['rolls']);
      const entriesRaw = po['entries'];
      const entries: LootEntry[] = [];
      if (Array.isArray(entriesRaw)) {
        for (const e of entriesRaw) {
          if (typeof e !== 'object' || e === null) continue;
          const eo = e as Record<string, unknown>;
          const t = entryType(typeof eo['type'] === 'string' ? eo['type'] : 'item');
          const rawName = typeof eo['name'] === 'string' ? eo['name'] : '';
          let name = '';
          if (t === 'tag') name = `#${mapVanillaItemName(rawName)}`;
          else if (t === 'item') name = mapVanillaItemName(rawName);
          const weight = typeof eo['weight'] === 'number' ? eo['weight'] : 1;
          const counts = readCountFromFunctions(eo['functions']);
          entries.push({ type: t, name, weight, countMin: counts.min, countMax: counts.max });
        }
      }
      pools.push({ rolls, entries });
    }
  }
  return { type, pools };
}
