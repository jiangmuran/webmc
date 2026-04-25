// Parse a vanilla enchantment_provider JSON (1.21+ datapack format).
// Used by /enchant and trade tables to randomize enchantments. Schema:
//   {
//     "type": "minecraft:single" | "minecraft:by_cost" | "minecraft:by_cost_with_difficulty",
//     "enchantment": "minecraft:sharpness" | "#minecraft:enchantable/sword",
//     "level": <int|range>,                    // for "single"
//     "enchantments": "#minecraft:on_random_loot",
//     "cost": { "min": 1, "max": 30 },         // for "by_cost"
//     "min_cost": ..., "max_cost": ...         // for "by_cost_with_difficulty"
//   }
//
// Source: minecraft.wiki "Enchantment provider". Behavioral spec —
// clean-room.

export type EnchantmentProviderKind = 'single' | 'by_cost' | 'by_cost_with_difficulty' | 'unknown';

export interface ParsedEnchantmentProvider {
  type: EnchantmentProviderKind;
  // Either a direct enchantment id (webmc:foo) or a tag ref (#webmc:foo).
  enchantment: string | null;
  // For "single", min and max may be equal.
  levelMin: number;
  levelMax: number;
  raw: Record<string, unknown>;
}

export class EnchantmentProviderParseError extends Error {}

const KINDS: ReadonlyArray<EnchantmentProviderKind> = [
  'single',
  'by_cost',
  'by_cost_with_difficulty',
];

function asKind(s: string): EnchantmentProviderKind {
  const local = s.replace(/^minecraft:/, '');
  return (KINDS as readonly string[]).includes(local)
    ? (local as EnchantmentProviderKind)
    : 'unknown';
}

function readEnchantmentRef(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  if (v.startsWith('#')) return `#webmc:${v.slice(1).replace(/^minecraft:/, '')}`;
  return `webmc:${v.replace(/^minecraft:/, '')}`;
}

function readRange(v: unknown): { min: number; max: number } {
  if (typeof v === 'number') return { min: Math.trunc(v), max: Math.trunc(v) };
  if (typeof v === 'object' && v !== null) {
    const o = v as Record<string, unknown>;
    const mn = typeof o['min'] === 'number' ? Math.trunc(o['min']) : 0;
    const mx = typeof o['max'] === 'number' ? Math.trunc(o['max']) : mn;
    return { min: mn, max: mx };
  }
  return { min: 0, max: 0 };
}

export function parseVanillaEnchantmentProvider(text: string): ParsedEnchantmentProvider {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new EnchantmentProviderParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new EnchantmentProviderParseError('enchantment_provider must be an object');
  const o = json as Record<string, unknown>;
  const t = typeof o['type'] === 'string' ? asKind(o['type']) : 'unknown';
  // Pick the level range based on the variant.
  let range = { min: 0, max: 0 };
  if (t === 'single') range = readRange(o['level']);
  else if (t === 'by_cost') range = readRange(o['cost']);
  else if (t === 'by_cost_with_difficulty') {
    const mn = readRange(o['min_cost']);
    const mx = readRange(o['max_cost']);
    range = { min: mn.min, max: mx.max };
  }
  return {
    type: t,
    enchantment:
      readEnchantmentRef(o['enchantment']) ?? readEnchantmentRef(o['enchantments']) ?? null,
    levelMin: range.min,
    levelMax: range.max,
    raw: o,
  };
}
