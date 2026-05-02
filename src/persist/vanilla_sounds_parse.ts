// Parse vanilla sounds.json — the resource pack sound event registry.
// Schema:
//   {
//     "block.stone.break": {
//       "category": "block",
//       "subtitle": "subtitles.block.generic.break",
//       "sounds": [
//         "block/stone/break1",
//         { "name": "block/stone/break2", "volume": 0.8, "pitch": 1.1, "weight": 2, "stream": false }
//       ]
//     }
//   }
//
// Source: minecraft.wiki "Sounds.json". Behavioral spec — clean-room.

export interface SoundVariant {
  name: string; // namespaced as webmc:
  volume: number;
  pitch: number;
  weight: number;
  stream: boolean;
}

export interface SoundEvent {
  category: string; // 'master' | 'music' | 'block' | ...
  subtitle: string | null;
  variants: SoundVariant[];
  // When true, vanilla replaces parent-pack entries instead of appending.
  replace: boolean;
}

export interface ParsedSoundsJson {
  events: Record<string, SoundEvent>;
}

export class SoundsParseError extends Error {}

function readVariant(v: unknown): SoundVariant {
  const def: SoundVariant = {
    name: '',
    volume: 1,
    pitch: 1,
    weight: 1,
    stream: false,
  };
  if (typeof v === 'string') {
    return { ...def, name: `webmc:${v.replace(/^minecraft:/, '')}` };
  }
  if (typeof v !== 'object' || v === null) return def;
  const o = v as Record<string, unknown>;
  return {
    name: typeof o['name'] === 'string' ? `webmc:${o['name'].replace(/^minecraft:/, '')}` : '',
    volume: typeof o['volume'] === 'number' ? o['volume'] : 1,
    pitch: typeof o['pitch'] === 'number' ? o['pitch'] : 1,
    weight: typeof o['weight'] === 'number' ? o['weight'] : 1,
    stream: o['stream'] === true,
  };
}

export function parseVanillaSoundsJson(text: string): ParsedSoundsJson {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new SoundsParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new SoundsParseError('sounds.json must be an object');
  const events: Record<string, SoundEvent> = {};
  for (const [key, raw] of Object.entries(json as Record<string, unknown>)) {
    if (typeof raw !== 'object' || raw === null) continue;
    const o = raw as Record<string, unknown>;
    const variants: SoundVariant[] = [];
    const soundsRaw = o['sounds'];
    if (Array.isArray(soundsRaw)) for (const s of soundsRaw) variants.push(readVariant(s));
    events[key] = {
      category: typeof o['category'] === 'string' ? o['category'] : 'master',
      subtitle: typeof o['subtitle'] === 'string' ? o['subtitle'] : null,
      variants,
      replace: o['replace'] === true,
    };
  }
  return { events };
}
