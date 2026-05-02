// Parse a vanilla equipment_asset JSON (1.21.5+ datapack format). These
// describe what textures armor uses for the humanoid and the wolf body
// armor models. Schema:
//   {
//     "layers": {
//       "humanoid":      [{ "texture": "minecraft:diamond" }],
//       "humanoid_leggings": [{ "texture": "minecraft:diamond" }],
//       "wolf_body":     [{ "texture": "minecraft:diamond" }],
//       "horse_body":    [{ "texture": "minecraft:diamond" }]
//     }
//   }
//
// Source: minecraft.wiki "Equipment". Behavioral spec — clean-room.

export interface EquipmentLayer {
  texture: string; // mapped webmc:foo
  // Whether to apply dye blending (1.21.5+ uses "dyeable: true").
  dyeable: boolean;
  raw: Record<string, unknown>;
}

export type EquipmentLayerKey =
  | 'humanoid'
  | 'humanoid_leggings'
  | 'wolf_body'
  | 'horse_body'
  | 'llama_body'
  | 'pig_saddle'
  | 'horse_saddle';

export interface ParsedEquipmentAsset {
  layers: Partial<Record<EquipmentLayerKey, EquipmentLayer[]>>;
}

export class EquipmentAssetParseError extends Error {}

const LAYER_KEYS: ReadonlyArray<EquipmentLayerKey> = [
  'humanoid',
  'humanoid_leggings',
  'wolf_body',
  'horse_body',
  'llama_body',
  'pig_saddle',
  'horse_saddle',
];

function readLayer(v: unknown): EquipmentLayer {
  const def: EquipmentLayer = { texture: '', dyeable: false, raw: {} };
  if (typeof v !== 'object' || v === null) return def;
  const o = v as Record<string, unknown>;
  const tex = typeof o['texture'] === 'string' ? o['texture'] : '';
  return {
    texture: tex ? `webmc:${tex.replace(/^minecraft:/, '')}` : '',
    dyeable: o['dyeable'] === true,
    raw: o,
  };
}

export function parseVanillaEquipmentAsset(text: string): ParsedEquipmentAsset {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new EquipmentAssetParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new EquipmentAssetParseError('equipment_asset must be an object');
  const layersRaw = (json as Record<string, unknown>)['layers'];
  const out: ParsedEquipmentAsset = { layers: {} };
  if (typeof layersRaw !== 'object' || layersRaw === null) return out;
  for (const key of LAYER_KEYS) {
    const arr = (layersRaw as Record<string, unknown>)[key];
    if (!Array.isArray(arr)) continue;
    out.layers[key] = arr.map(readLayer);
  }
  return out;
}
