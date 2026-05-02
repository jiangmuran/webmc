// Parse a vanilla font JSON (assets/<ns>/font/*.json). A font is a list
// of "providers"; each provider sources glyphs from a different place:
//   { "providers": [
//       { "type": "bitmap", "file": "minecraft:font/ascii.png", "ascent": 7, "chars": ["..."] },
//       { "type": "ttf",    "file": "minecraft:font/inter.ttf", "size": 16, "shift": [0,1] },
//       { "type": "space",  "advances": { " ": 4 } },
//       { "type": "legacy_unicode", "sizes": "...", "template": "..." },
//       { "type": "reference", "id": "minecraft:default" }
//     ]
//   }
//
// Source: minecraft.wiki "Font". Behavioral spec — clean-room.

export type FontProviderKind =
  | 'bitmap'
  | 'ttf'
  | 'space'
  | 'legacy_unicode'
  | 'reference'
  | 'unknown';

export interface FontProvider {
  type: FontProviderKind;
  raw: Record<string, unknown>;
}

export interface ParsedFont {
  providers: FontProvider[];
}

export class FontParseError extends Error {}

const KINDS: ReadonlyArray<FontProviderKind> = [
  'bitmap',
  'ttf',
  'space',
  'legacy_unicode',
  'reference',
];

function asKind(s: string): FontProviderKind {
  const local = s.replace(/^minecraft:/, '');
  return (KINDS as readonly string[]).includes(local) ? (local as FontProviderKind) : 'unknown';
}

export function parseVanillaFont(text: string): ParsedFont {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new FontParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null) throw new FontParseError('font must be an object');
  const o = json as Record<string, unknown>;
  const providers: FontProvider[] = [];
  if (Array.isArray(o['providers'])) {
    for (const p of o['providers']) {
      if (typeof p !== 'object' || p === null) continue;
      const po = p as Record<string, unknown>;
      const t = typeof po['type'] === 'string' ? asKind(po['type']) : 'unknown';
      providers.push({ type: t, raw: po });
    }
  }
  return { providers };
}
