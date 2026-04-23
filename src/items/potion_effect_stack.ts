export interface StackEntry {
  id: string;
  amplifier: number;
  durationTicks: number;
}

export function applyNew(existing: StackEntry[], incoming: StackEntry): StackEntry[] {
  const idx = existing.findIndex((e) => e.id === incoming.id);
  if (idx < 0) return [...existing, incoming];
  const current = existing[idx];
  if (!current) return [...existing, incoming];
  const next: StackEntry[] = [...existing];
  if (incoming.amplifier > current.amplifier) {
    next[idx] = incoming;
  } else if (incoming.amplifier === current.amplifier && incoming.durationTicks > current.durationTicks) {
    next[idx] = incoming;
  }
  return next;
}

export function tickDown(existing: StackEntry[]): StackEntry[] {
  return existing
    .map((e) => ({ ...e, durationTicks: e.durationTicks - 1 }))
    .filter((e) => e.durationTicks > 0);
}
