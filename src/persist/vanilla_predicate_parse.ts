// Parse a vanilla predicate JSON. Predicates are referenced from
// recipes, loot tables, and advancements. Schema is a list of conditions
// or a single condition with a `condition` (or `type`) discriminator:
//
//   { "condition": "minecraft:entity_properties", "entity": "this", "predicate": {...} }
//
// We extract the discriminator (mapped to webmc namespace) and keep the
// raw object so callers can introspect.
//
// Source: minecraft.wiki "Predicate". Behavioral spec — clean-room.

export interface ParsedPredicate {
  type: string; // mapped condition type (webmc:condition_kind)
  raw: Record<string, unknown>;
}

export class PredicateParseError extends Error {}

function readOne(v: unknown): ParsedPredicate {
  if (typeof v !== 'object' || v === null) return { type: '', raw: {} };
  const o = v as Record<string, unknown>;
  const rawType =
    typeof o['condition'] === 'string'
      ? o['condition']
      : typeof o['type'] === 'string'
        ? o['type']
        : '';
  return {
    type: rawType ? `webmc:${rawType.replace(/^minecraft:/, '')}` : '',
    raw: o,
  };
}

export function parseVanillaPredicate(text: string): ParsedPredicate[] {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new PredicateParseError(`invalid JSON: ${String(e)}`);
  }
  if (Array.isArray(json)) return json.map(readOne);
  return [readOne(json)];
}
