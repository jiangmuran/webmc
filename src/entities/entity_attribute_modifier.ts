export type Operation = 'add_value' | 'add_multiplied_base' | 'add_multiplied_total';

export interface Modifier {
  id: string;
  operation: Operation;
  value: number;
}

export function computeAttribute(base: number, modifiers: readonly Modifier[]): number {
  let result = base;
  for (const m of modifiers) {
    if (m.operation === 'add_value') result += m.value;
  }
  let multiplier = 1;
  for (const m of modifiers) {
    if (m.operation === 'add_multiplied_base') multiplier += m.value;
  }
  result *= multiplier;
  for (const m of modifiers) {
    if (m.operation === 'add_multiplied_total') result *= 1 + m.value;
  }
  return result;
}

export function combineModifiers(
  existing: readonly Modifier[],
  added: Modifier,
): readonly Modifier[] {
  if (existing.some((m) => m.id === added.id)) return existing;
  return [...existing, added];
}

export function removeModifier(existing: readonly Modifier[], id: string): readonly Modifier[] {
  return existing.filter((m) => m.id !== id);
}
