// Parse vanilla worldgen feature JSON (placed_feature + configured_feature).
//
// configured_feature schema:
//   { "type": "minecraft:tree", "config": {...} }
//
// placed_feature schema:
//   { "feature": "minecraft:oak"  | { ... configured_feature inline },
//     "placement": [ { "type": "minecraft:count", "count": 10 }, ... ]
//   }
//
// Source: minecraft.wiki "Configured feature" / "Placed feature".
// Behavioral spec — clean-room.

export interface PlacementModifier {
  type: string; // mapped webmc:foo
  raw: Record<string, unknown>;
}

export interface ParsedConfiguredFeature {
  type: string; // mapped webmc:foo
  raw: Record<string, unknown>;
}

export interface ParsedPlacedFeature {
  // Either a string id reference to a configured_feature, or the inline definition.
  feature: string | ParsedConfiguredFeature;
  placement: PlacementModifier[];
}

export class FeatureParseError extends Error {}

function readPlacement(v: unknown): PlacementModifier[] {
  if (!Array.isArray(v)) return [];
  const out: PlacementModifier[] = [];
  for (const e of v) {
    if (typeof e !== 'object' || e === null) continue;
    const o = e as Record<string, unknown>;
    const t = typeof o['type'] === 'string' ? o['type'] : '';
    out.push({ type: t ? `webmc:${t.replace(/^minecraft:/, '')}` : '', raw: o });
  }
  return out;
}

export function parseVanillaConfiguredFeature(text: string): ParsedConfiguredFeature {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new FeatureParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new FeatureParseError('configured_feature must be an object');
  const o = json as Record<string, unknown>;
  const t = typeof o['type'] === 'string' ? o['type'] : '';
  return {
    type: t ? `webmc:${t.replace(/^minecraft:/, '')}` : '',
    raw: o,
  };
}

function readFeatureRef(v: unknown): string | ParsedConfiguredFeature {
  if (typeof v === 'string') return `webmc:${v.replace(/^minecraft:/, '')}`;
  if (typeof v === 'object' && v !== null) {
    const o = v as Record<string, unknown>;
    const t = typeof o['type'] === 'string' ? o['type'] : '';
    return {
      type: t ? `webmc:${t.replace(/^minecraft:/, '')}` : '',
      raw: o,
    };
  }
  return '';
}

export function parseVanillaPlacedFeature(text: string): ParsedPlacedFeature {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new FeatureParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new FeatureParseError('placed_feature must be an object');
  const o = json as Record<string, unknown>;
  return {
    feature: readFeatureRef(o['feature']),
    placement: readPlacement(o['placement']),
  };
}
