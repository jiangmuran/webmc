// Parse a vanilla blockstate JSON. The blockstate file maps each block
// state to one or more model references. Schema (subset):
//
//   { "variants": { "<state-key>": <variant> | [<variant>, ...] } }
//   <variant> = { "model": "minecraft:block/stone", "x": 90, "y": 0, ... }
//
// Or the multipart form:
//
//   { "multipart": [ { "when": {...}, "apply": <variant> }, ... ] }
//
// Source: minecraft.wiki "Model". Behavioral spec — clean-room.

export interface ModelRef {
  model: string;
  x: number;
  y: number;
  uvlock: boolean;
  weight: number;
}

export interface VariantBranch {
  // The state-key, e.g. "facing=north,half=top". Empty string for the default branch.
  key: string;
  models: ModelRef[];
}

export interface MultipartCase {
  when: Record<string, string>; // empty = always apply
  apply: ModelRef[];
}

export interface ParsedBlockstate {
  // Mutually exclusive in vanilla; we expose both so callers can branch
  // on which is non-empty.
  variants: VariantBranch[];
  multipart: MultipartCase[];
}

export class BlockstateParseError extends Error {}

function readModelRef(v: unknown): ModelRef {
  if (typeof v !== 'object' || v === null) {
    return { model: '', x: 0, y: 0, uvlock: false, weight: 1 };
  }
  const o = v as Record<string, unknown>;
  return {
    model: typeof o['model'] === 'string' ? `webmc:${o['model'].replace(/^minecraft:/, '')}` : '',
    x: typeof o['x'] === 'number' ? o['x'] : 0,
    y: typeof o['y'] === 'number' ? o['y'] : 0,
    uvlock: o['uvlock'] === true,
    weight: typeof o['weight'] === 'number' ? o['weight'] : 1,
  };
}

function readModelOrList(v: unknown): ModelRef[] {
  if (Array.isArray(v)) return v.map(readModelRef);
  return [readModelRef(v)];
}

function readWhen(v: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof v !== 'object' || v === null) return out;
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (typeof val === 'string') out[k] = val;
    else if (typeof val === 'boolean' || typeof val === 'number') out[k] = String(val);
  }
  return out;
}

export function parseVanillaBlockstate(text: string): ParsedBlockstate {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new BlockstateParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new BlockstateParseError('blockstate must be an object');
  const obj = json as Record<string, unknown>;

  const variants: VariantBranch[] = [];
  const variantsRaw = obj['variants'];
  if (typeof variantsRaw === 'object' && variantsRaw !== null) {
    for (const [key, val] of Object.entries(variantsRaw as Record<string, unknown>)) {
      variants.push({ key, models: readModelOrList(val) });
    }
  }

  const multipart: MultipartCase[] = [];
  const multipartRaw = obj['multipart'];
  if (Array.isArray(multipartRaw)) {
    for (const c of multipartRaw) {
      if (typeof c !== 'object' || c === null) continue;
      const co = c as Record<string, unknown>;
      multipart.push({
        when: readWhen(co['when']),
        apply: readModelOrList(co['apply']),
      });
    }
  }

  return { variants, multipart };
}
