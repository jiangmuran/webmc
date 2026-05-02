// Parse a vanilla language JSON (lang/en_us.json). Format is a flat
// dictionary { "translation.key": "Translated value", ... }. Keys are
// dotted paths (block.minecraft.stone, advancements.story.title, etc.).
//
// Source: minecraft.wiki "Language". Behavioral spec — clean-room.

export interface ParsedLang {
  // Flat dictionary, fully populated from the JSON.
  entries: Record<string, string>;
  // Number of unique top-level prefixes (block, item, advancements, ...)
  // — useful for quick stats.
  topLevelPrefixCount: number;
}

export class LangParseError extends Error {}

export function parseVanillaLang(text: string): ParsedLang {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new LangParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new LangParseError('lang JSON must be an object');
  const entries: Record<string, string> = {};
  const prefixes = new Set<string>();
  for (const [k, v] of Object.entries(json as Record<string, unknown>)) {
    if (typeof v !== 'string') continue;
    entries[k] = v;
    const dot = k.indexOf('.');
    prefixes.add(dot === -1 ? k : k.slice(0, dot));
  }
  return { entries, topLevelPrefixCount: prefixes.size };
}

// Look up a translation key, falling back to the key itself when absent.
// Mirrors vanilla's behavior of rendering unknown keys as plain text.
export function translate(lang: ParsedLang, key: string): string {
  return lang.entries[key] ?? key;
}
