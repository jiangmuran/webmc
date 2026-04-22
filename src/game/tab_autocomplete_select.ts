// Tab autocomplete selection. When user presses Tab while typing, we
// present matching suggestions and cycle on repeated Tab.

export interface SuggestState {
  input: string;
  suggestions: string[];
  selectedIndex: number;
  cursorPos: number; // within input
}

export function makeSuggest(input: string, cursor: number): SuggestState {
  return { input, suggestions: [], selectedIndex: -1, cursorPos: cursor };
}

// Extract the token the cursor is in.
export function currentToken(input: string, cursor: number): { token: string; start: number } {
  let s = cursor;
  while (s > 0 && /\S/.test(input[s - 1] ?? '')) s -= 1;
  return { token: input.slice(s, cursor), start: s };
}

export function computeSuggestions(input: string, cursor: number, all: string[]): string[] {
  const { token } = currentToken(input, cursor);
  if (!token) return [];
  const lower = token.toLowerCase();
  return all.filter((s) => s.toLowerCase().startsWith(lower));
}

export function cycle(s: SuggestState, direction: 1 | -1): void {
  if (s.suggestions.length === 0) {
    s.selectedIndex = -1;
    return;
  }
  s.selectedIndex =
    s.selectedIndex === -1
      ? direction > 0
        ? 0
        : s.suggestions.length - 1
      : (s.selectedIndex + direction + s.suggestions.length) % s.suggestions.length;
}

export function apply(s: SuggestState): string | null {
  if (s.selectedIndex < 0) return null;
  const choice = s.suggestions[s.selectedIndex];
  if (!choice) return null;
  const { start } = currentToken(s.input, s.cursorPos);
  return s.input.slice(0, start) + choice + s.input.slice(s.cursorPos);
}
