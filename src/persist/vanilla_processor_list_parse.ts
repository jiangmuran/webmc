// Parse a vanilla worldgen processor_list JSON. Processor lists are
// applied to jigsaw template elements to perform block substitutions /
// rotations / wear-and-tear. Schema:
//
//   { "processors": [
//       { "processor_type": "minecraft:rule",
//         "rules": [ { "input_predicate": {...}, "output_state": {...}, "location_predicate": {...} } ] },
//       { "processor_type": "minecraft:gravity", "heightmap": "WORLD_SURFACE_WG" }
//     ]
//   }
//
// We extract the discriminator + keep the raw object so callers can
// introspect type-specific fields without us pinning the schema.
//
// Source: minecraft.wiki "Processor". Behavioral spec — clean-room.

export interface ParsedProcessor {
  type: string; // mapped webmc:foo
  raw: Record<string, unknown>;
}

export interface ParsedProcessorList {
  processors: ParsedProcessor[];
}

export class ProcessorListParseError extends Error {}

function readProcessor(v: unknown): ParsedProcessor {
  if (typeof v !== 'object' || v === null) return { type: '', raw: {} };
  const o = v as Record<string, unknown>;
  const t = typeof o['processor_type'] === 'string' ? o['processor_type'] : '';
  return {
    type: t ? `webmc:${t.replace(/^minecraft:/, '')}` : '',
    raw: o,
  };
}

export function parseVanillaProcessorList(text: string): ParsedProcessorList {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new ProcessorListParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new ProcessorListParseError('processor_list must be an object');
  const o = json as Record<string, unknown>;
  const processors: ParsedProcessor[] = [];
  if (Array.isArray(o['processors']))
    for (const p of o['processors']) processors.push(readProcessor(p));
  return { processors };
}
