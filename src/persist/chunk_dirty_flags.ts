export type DirtyFlag = 'blocks' | 'lighting' | 'biome' | 'entities' | 'block_entities';

export interface DirtyTracker {
  byChunk: Map<string, Set<DirtyFlag>>;
}

export function key(cx: number, cz: number): string {
  return `${cx},${cz}`;
}

export function markDirty(t: DirtyTracker, cx: number, cz: number, flag: DirtyFlag): void {
  const k = key(cx, cz);
  const existing = t.byChunk.get(k);
  if (existing === undefined) t.byChunk.set(k, new Set([flag]));
  else existing.add(flag);
}

export function isDirty(t: DirtyTracker, cx: number, cz: number, flag: DirtyFlag): boolean {
  return t.byChunk.get(key(cx, cz))?.has(flag) ?? false;
}

export function drainDirtyChunks(
  t: DirtyTracker,
): readonly { cx: number; cz: number; flags: ReadonlySet<DirtyFlag> }[] {
  const out: { cx: number; cz: number; flags: ReadonlySet<DirtyFlag> }[] = [];
  for (const [k, flags] of t.byChunk.entries()) {
    const [cx, cz] = k.split(',').map(Number) as [number, number];
    out.push({ cx, cz, flags });
  }
  t.byChunk.clear();
  return out;
}

export function createTracker(): DirtyTracker {
  return { byChunk: new Map() };
}
