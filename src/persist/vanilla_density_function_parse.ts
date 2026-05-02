// Parse a vanilla worldgen density_function JSON. Density functions are
// the algebraic expressions that drive 1.18+ noise terrain generation.
// The schema is recursive (every operand can itself be a density function
// or a constant float). We extract only the top-level discriminator + a
// flat list of nested function types so callers can survey what a pack
// uses without us shipping the full evaluator.
//
// Source: minecraft.wiki "Density function". Behavioral spec — clean-room.

export interface ParsedDensityFunction {
  type: string; // mapped webmc:foo, or empty for constant numbers
  // Numeric constant when the JSON was a bare number.
  constant: number | null;
  // Flat list of all referenced function types found inside the tree
  // (deduped, mapped to webmc namespace). Includes the root type.
  referencedTypes: string[];
  raw: unknown;
}

export class DensityFunctionParseError extends Error {}

function collectTypes(v: unknown, out: Set<string>): void {
  if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    if (typeof o['type'] === 'string') {
      out.add(`webmc:${o['type'].replace(/^minecraft:/, '')}`);
    }
    for (const child of Object.values(o)) collectTypes(child, out);
    return;
  }
  if (Array.isArray(v)) for (const child of v) collectTypes(child, out);
}

export function parseVanillaDensityFunction(text: string): ParsedDensityFunction {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new DensityFunctionParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json === 'number') {
    return { type: '', constant: json, referencedTypes: [], raw: json };
  }
  if (typeof json !== 'object' || json === null)
    throw new DensityFunctionParseError('density_function must be an object or number');
  const o = json as Record<string, unknown>;
  const t = typeof o['type'] === 'string' ? o['type'] : '';
  const all = new Set<string>();
  collectTypes(o, all);
  return {
    type: t ? `webmc:${t.replace(/^minecraft:/, '')}` : '',
    constant: null,
    referencedTypes: [...all].sort(),
    raw: o,
  };
}
