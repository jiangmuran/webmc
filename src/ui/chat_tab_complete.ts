export function completions(input: string, candidates: string[]): string[] {
  const lower = input.toLowerCase();
  return candidates.filter((c) => c.toLowerCase().startsWith(lower));
}

export function nextCompletion(current: string, cycles: string[], forward: boolean): string {
  if (cycles.length === 0) return current;
  const idx = cycles.indexOf(current);
  if (idx === -1) return cycles[0] ?? current;
  const step = forward ? 1 : -1;
  const next = (idx + step + cycles.length) % cycles.length;
  return cycles[next] ?? current;
}
