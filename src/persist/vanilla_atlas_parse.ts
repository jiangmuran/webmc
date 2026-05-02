// Parse a vanilla atlas JSON (1.19.3+ resource pack format). Schema:
//   { "sources": [
//       { "type": "minecraft:directory", "source": "block", "prefix": "block/" },
//       { "type": "minecraft:single",    "resource": "entity/wolf", "sprite": "entity/wolf" },
//       { "type": "minecraft:filter",    "namespace": "minecraft", "path": "block/oak_planks" },
//       { "type": "minecraft:unstitch",  "resource": "...", "regions": [{"sprite":"...","x":0,"y":0,"width":16,"height":16}] }
//     ]
//   }
//
// Atlas files (atlases/*.json) tell the renderer which textures to
// stitch into each named atlas (blocks, banner_patterns, paintings,
// gui, etc).
//
// Source: minecraft.wiki "Atlas". Behavioral spec — clean-room.

export type AtlasSourceKind =
  | 'directory'
  | 'single'
  | 'filter'
  | 'unstitch'
  | 'paletted_permutations'
  | 'unknown';

export interface AtlasSource {
  type: AtlasSourceKind;
  raw: Record<string, unknown>;
}

export interface ParsedAtlas {
  sources: AtlasSource[];
}

export class AtlasParseError extends Error {}

const KINDS: ReadonlyArray<AtlasSourceKind> = [
  'directory',
  'single',
  'filter',
  'unstitch',
  'paletted_permutations',
];

function asKind(s: string): AtlasSourceKind {
  const local = s.replace(/^minecraft:/, '');
  return (KINDS as readonly string[]).includes(local) ? (local as AtlasSourceKind) : 'unknown';
}

export function parseVanillaAtlas(text: string): ParsedAtlas {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new AtlasParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new AtlasParseError('atlas must be an object');
  const o = json as Record<string, unknown>;
  const sources: AtlasSource[] = [];
  if (Array.isArray(o['sources'])) {
    for (const s of o['sources']) {
      if (typeof s !== 'object' || s === null) continue;
      const so = s as Record<string, unknown>;
      const t = typeof so['type'] === 'string' ? asKind(so['type']) : 'unknown';
      sources.push({ type: t, raw: so });
    }
  }
  return { sources };
}
