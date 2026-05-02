// Parse a vanilla worldgen structure JSON (NOT to be confused with the
// .nbt structure block file — that's structure_block_parse.ts).
// Schema:
//   {
//     "type": "minecraft:jigsaw" | "minecraft:single_pool_element" | ...,
//     "biomes": "#minecraft:has_structure/village" | ["minecraft:plains"],
//     "step": "underground_decoration",
//     "spawn_overrides": {...},
//     // type-specific fields stored in raw:
//     "start_pool": "minecraft:village/plains/town_centers",
//     "size": 6
//   }
//
// Source: minecraft.wiki "Custom structure". Behavioral spec — clean-room.

export interface ParsedStructureJson {
  type: string; // mapped webmc:foo
  biomes: string[]; // each entry mapped to webmc; tag refs keep #
  step: string;
  raw: Record<string, unknown>;
}

export class StructureJsonParseError extends Error {}

function namespaceMap(s: string): string {
  if (s.startsWith('#')) return `#webmc:${s.slice(1).replace(/^minecraft:/, '')}`;
  return `webmc:${s.replace(/^minecraft:/, '')}`;
}

function readBiomes(v: unknown): string[] {
  if (typeof v === 'string') return [namespaceMap(v)];
  if (Array.isArray(v)) {
    const out: string[] = [];
    for (const e of v) if (typeof e === 'string') out.push(namespaceMap(e));
    return out;
  }
  return [];
}

export function parseVanillaStructureJson(text: string): ParsedStructureJson {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new StructureJsonParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new StructureJsonParseError('structure must be an object');
  const o = json as Record<string, unknown>;
  const t = typeof o['type'] === 'string' ? o['type'] : '';
  return {
    type: t ? `webmc:${t.replace(/^minecraft:/, '')}` : '',
    biomes: readBiomes(o['biomes']),
    step: typeof o['step'] === 'string' ? o['step'] : '',
    raw: o,
  };
}
