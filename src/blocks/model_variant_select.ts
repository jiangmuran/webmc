// Model variant selector for block states. Each variant key maps a
// stringified state (e.g., "facing=east,open=true") to a model ref.

export interface VariantEntry {
  matcher: Record<string, string>;
  model: string;
  weight: number;
}

export function variantMatches(v: VariantEntry, state: Record<string, string>): boolean {
  for (const [k, want] of Object.entries(v.matcher)) {
    if (state[k] !== want) return false;
  }
  return true;
}

export function selectVariant(
  variants: VariantEntry[],
  state: Record<string, string>,
  rand: () => number,
): VariantEntry | null {
  const matches = variants.filter((v) => variantMatches(v, state));
  if (matches.length === 0) return null;
  const total = matches.reduce((s, v) => s + v.weight, 0);
  let r = rand() * total;
  for (const v of matches) {
    if (r < v.weight) return v;
    r -= v.weight;
  }
  return matches[matches.length - 1] ?? null;
}
