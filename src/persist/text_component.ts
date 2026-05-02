// Flatten a vanilla "text component" — JSON form used in chat messages,
// signs, advancements, pack.mcmeta descriptions — to a plain string.
// Vanilla "text components" are a recursive shape: string, number, bool,
// array of components, or object with optional "text" / "translate" /
// "extra" / "with" fields. We only emit the visible characters.
//
// Source: minecraft.wiki "Raw JSON text format". Behavioral spec — clean-room.

export function flattenTextComponent(c: unknown): string {
  if (c === null || c === undefined) return '';
  if (typeof c === 'string') return c;
  if (typeof c === 'number' || typeof c === 'boolean') return String(c);
  if (Array.isArray(c)) return c.map(flattenTextComponent).join('');
  if (typeof c === 'object') {
    const obj = c as Record<string, unknown>;
    let out = '';
    if (typeof obj['text'] === 'string') out += obj['text'];
    else if (typeof obj['translate'] === 'string') out += obj['translate'];
    if (Array.isArray(obj['extra'])) out += flattenTextComponent(obj['extra']);
    return out;
  }
  return '';
}
