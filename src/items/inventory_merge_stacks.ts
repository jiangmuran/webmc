export interface Stack {
  id: string;
  count: number;
  maxStack: number;
}

export function addToInventory(
  slots: (Stack | undefined)[],
  toAdd: Stack,
): { slots: (Stack | undefined)[]; overflow: number } {
  let remaining = toAdd.count;
  const out = [...slots];
  for (let i = 0; i < out.length && remaining > 0; i++) {
    const s = out[i];
    if (s?.id !== toAdd.id) continue;
    const space = s.maxStack - s.count;
    if (space <= 0) continue;
    const add = Math.min(space, remaining);
    out[i] = { ...s, count: s.count + add };
    remaining -= add;
  }
  for (let i = 0; i < out.length && remaining > 0; i++) {
    if (out[i] !== undefined) continue;
    const add = Math.min(toAdd.maxStack, remaining);
    out[i] = { id: toAdd.id, count: add, maxStack: toAdd.maxStack };
    remaining -= add;
  }
  return { slots: out, overflow: remaining };
}

export function consume(
  slots: (Stack | undefined)[],
  id: string,
  count: number,
): { slots: (Stack | undefined)[]; consumed: number } {
  let need = count;
  const out = [...slots];
  for (let i = 0; i < out.length && need > 0; i++) {
    const s = out[i];
    if (s?.id !== id) continue;
    const take = Math.min(s.count, need);
    const left = s.count - take;
    out[i] = left === 0 ? undefined : { ...s, count: left };
    need -= take;
  }
  return { slots: out, consumed: count - need };
}
