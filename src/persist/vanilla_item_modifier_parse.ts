// Parse a vanilla item_modifier JSON (datapack format). Item modifiers
// are functions referenced from /item, loot tables, and trade lists.
// Format is either a single function object or an array of them:
//
//   { "function": "minecraft:set_count", "count": 4 }
//   [{...}, {...}]
//
// We extract the namespaced function name + keep the raw payload.
//
// Source: minecraft.wiki "Item modifier". Behavioral spec — clean-room.

export interface ParsedItemModifier {
  function: string; // mapped to webmc namespace
  raw: Record<string, unknown>;
}

export class ItemModifierParseError extends Error {}

function readOne(v: unknown): ParsedItemModifier {
  if (typeof v !== 'object' || v === null) return { function: '', raw: {} };
  const o = v as Record<string, unknown>;
  const rawFn = typeof o['function'] === 'string' ? o['function'] : '';
  return {
    function: rawFn ? `webmc:${rawFn.replace(/^minecraft:/, '')}` : '',
    raw: o,
  };
}

export function parseVanillaItemModifier(text: string): ParsedItemModifier[] {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new ItemModifierParseError(`invalid JSON: ${String(e)}`);
  }
  if (Array.isArray(json)) return json.map(readOne);
  return [readOne(json)];
}
