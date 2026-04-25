// Parse pack.mcmeta — the small JSON file at the root of every vanilla
// resource pack. Schema (post-1.6):
//   { "pack": { "pack_format": <int>, "description": <text-or-component> } }
//
// Vanilla "description" can be a plain string or a JSON-text-component
// (object or array). We coerce all variants to a flat string for
// display.
//
// Source: minecraft.wiki "Resource pack". Behavioral spec — clean-room.

export interface PackMeta {
  packFormat: number;
  description: string;
  // Optional supported_formats (1.20.2+) as either int or {min_inclusive, max_inclusive}.
  supportedFormatsMin: number | null;
  supportedFormatsMax: number | null;
}

function flattenComponent(c: unknown): string {
  if (c === null || c === undefined) return '';
  if (typeof c === 'string') return c;
  if (typeof c === 'number' || typeof c === 'boolean') return String(c);
  if (Array.isArray(c)) return c.map(flattenComponent).join('');
  if (typeof c === 'object') {
    const obj = c as Record<string, unknown>;
    let out = '';
    if (typeof obj['text'] === 'string') out += obj['text'];
    if (Array.isArray(obj['extra'])) out += flattenComponent(obj['extra']);
    return out;
  }
  return '';
}

export class PackMetaError extends Error {}

export function parsePackMcmeta(text: string): PackMeta {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new PackMetaError(`invalid JSON: ${String(e)}`);
  }
  if (typeof parsed !== 'object' || parsed === null)
    throw new PackMetaError('mcmeta must be an object');
  const pack = (parsed as Record<string, unknown>)['pack'];
  if (typeof pack !== 'object' || pack === null) throw new PackMetaError('missing "pack" field');
  const p = pack as Record<string, unknown>;
  const packFormat = Number(p['pack_format']);
  if (!Number.isFinite(packFormat)) throw new PackMetaError('"pack_format" must be a number');
  const description = flattenComponent(p['description']);
  let supportedMin: number | null = null;
  let supportedMax: number | null = null;
  const sf = p['supported_formats'];
  if (typeof sf === 'number') {
    supportedMin = sf;
    supportedMax = sf;
  } else if (Array.isArray(sf) && sf.length === 2) {
    supportedMin = Number(sf[0]);
    supportedMax = Number(sf[1]);
  } else if (typeof sf === 'object' && sf !== null) {
    const r = sf as Record<string, unknown>;
    const mn = Number(r['min_inclusive']);
    const mx = Number(r['max_inclusive']);
    if (Number.isFinite(mn)) supportedMin = mn;
    if (Number.isFinite(mx)) supportedMax = mx;
  }
  return {
    packFormat: Math.trunc(packFormat),
    description,
    supportedFormatsMin: supportedMin,
    supportedFormatsMax: supportedMax,
  };
}
