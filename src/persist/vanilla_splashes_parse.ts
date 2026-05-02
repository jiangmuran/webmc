// Parse vanilla splashes.txt — the splash-line catalog rendered on the
// title screen. Format is plain UTF-8 text, one splash per line. Empty
// lines are skipped; vanilla doesn't have a comment syntax so we don't
// strip any.
//
// Source: minecraft.wiki "Splash text". Behavioral spec — clean-room.

export interface ParsedSplashes {
  lines: string[];
}

export function parseVanillaSplashes(text: string): ParsedSplashes {
  if (text.length === 0) return { lines: [] };
  const out: string[] = [];
  for (const raw of text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')) {
    const trimmed = raw.replace(/\s+$/, '');
    if (trimmed.length > 0) out.push(trimmed);
  }
  return { lines: out };
}

// Pick a splash deterministically from a numeric seed (e.g. Date.now())
// so the same minute renders the same splash across multiple peers in a
// session.
export function pickSplash(parsed: ParsedSplashes, seed: number, fallback = ''): string {
  if (parsed.lines.length === 0) return fallback;
  const idx = Math.abs(Math.trunc(seed)) % parsed.lines.length;
  return parsed.lines[idx] ?? fallback;
}
