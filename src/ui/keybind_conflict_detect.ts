export interface Binding {
  action: string;
  key: string;
  modifier?: 'shift' | 'ctrl' | 'alt';
}

export function conflictKey(b: Binding): string {
  return `${b.modifier ?? ''}:${b.key}`;
}

export function conflicts(bindings: Binding[]): [string, string][] {
  const byKey = new Map<string, string[]>();
  for (const b of bindings) {
    const k = conflictKey(b);
    const existing = byKey.get(k) ?? [];
    existing.push(b.action);
    byKey.set(k, existing);
  }
  const pairs: [string, string][] = [];
  for (const actions of byKey.values()) {
    for (let i = 0; i < actions.length; i++) {
      for (let j = i + 1; j < actions.length; j++) {
        const a = actions[i];
        const b = actions[j];
        if (a !== undefined && b !== undefined) pairs.push([a, b]);
      }
    }
  }
  return pairs;
}
