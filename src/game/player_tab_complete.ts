// Tab completion for chat/commands. Match prefix case-insensitively
// against a sorted candidate list. Cycles through suggestions with
// subsequent Tab presses.

export interface TabState {
  prefix: string;
  matches: string[];
  index: number;
}

export function startCompletion(prefix: string, candidates: string[]): TabState {
  const lower = prefix.toLowerCase();
  const matches = candidates.filter((c) => c.toLowerCase().startsWith(lower)).sort();
  return { prefix, matches, index: 0 };
}

export function currentSuggestion(s: TabState): string | null {
  return s.matches[s.index] ?? null;
}

export function advance(s: TabState): TabState {
  if (s.matches.length === 0) return s;
  return { ...s, index: (s.index + 1) % s.matches.length };
}

export function isEmpty(s: TabState): boolean {
  return s.matches.length === 0;
}
