// Parse a vanilla worldgen template_pool JSON. Pools list a set of
// jigsaw building pieces with weights for use during structure
// generation. Schema:
//   {
//     "name": "minecraft:village/plains/houses",
//     "fallback": "minecraft:empty",
//     "elements": [
//       { "weight": 5, "element": { "element_type": "minecraft:single_pool_element",
//                                    "location": "minecraft:village/plains/houses/house1",
//                                    "projection": "rigid" } }
//     ]
//   }
//
// Source: minecraft.wiki "Template pool". Behavioral spec — clean-room.

export interface TemplatePoolEntry {
  weight: number;
  elementType: string; // mapped webmc:foo
  location: string | null; // mapped webmc:foo when present
  projection: string; // 'rigid' | 'terrain_matching' | ...
  raw: Record<string, unknown>;
}

export interface ParsedTemplatePool {
  name: string;
  fallback: string;
  elements: TemplatePoolEntry[];
}

export class TemplatePoolParseError extends Error {}

function readEntry(v: unknown): TemplatePoolEntry {
  const def: TemplatePoolEntry = {
    weight: 1,
    elementType: '',
    location: null,
    projection: 'rigid',
    raw: {},
  };
  if (typeof v !== 'object' || v === null) return def;
  const o = v as Record<string, unknown>;
  const weight = typeof o['weight'] === 'number' ? o['weight'] : 1;
  const el = o['element'];
  if (typeof el !== 'object' || el === null) return { ...def, weight };
  const eo = el as Record<string, unknown>;
  const t = typeof eo['element_type'] === 'string' ? eo['element_type'] : '';
  const loc = typeof eo['location'] === 'string' ? eo['location'] : null;
  return {
    weight,
    elementType: t ? `webmc:${t.replace(/^minecraft:/, '')}` : '',
    location: loc ? `webmc:${loc.replace(/^minecraft:/, '')}` : null,
    projection: typeof eo['projection'] === 'string' ? eo['projection'] : 'rigid',
    raw: eo,
  };
}

export function parseVanillaTemplatePool(text: string): ParsedTemplatePool {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new TemplatePoolParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new TemplatePoolParseError('template_pool must be an object');
  const o = json as Record<string, unknown>;
  const name = typeof o['name'] === 'string' ? o['name'] : '';
  const fallback = typeof o['fallback'] === 'string' ? o['fallback'] : '';
  const elements: TemplatePoolEntry[] = [];
  if (Array.isArray(o['elements'])) for (const e of o['elements']) elements.push(readEntry(e));
  return {
    name: name ? `webmc:${name.replace(/^minecraft:/, '')}` : '',
    fallback: fallback ? `webmc:${fallback.replace(/^minecraft:/, '')}` : '',
    elements,
  };
}
