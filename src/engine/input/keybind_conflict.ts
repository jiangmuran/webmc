export interface Binding {
  action: string;
  key: string;
}

export function conflicts(bindings: Binding[]): [string, string][] {
  const byKey = new Map<string, string[]>();
  for (const b of bindings) {
    const list = byKey.get(b.key) ?? [];
    list.push(b.action);
    byKey.set(b.key, list);
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
