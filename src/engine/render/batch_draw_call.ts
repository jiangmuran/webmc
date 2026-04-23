export interface DrawCall {
  material: string;
  meshId: string;
  transform: Float32Array;
}

export function sortByMaterial(calls: DrawCall[]): DrawCall[] {
  return [...calls].sort((a, b) => a.material.localeCompare(b.material));
}

export function materialChangeCount(sorted: DrawCall[]): number {
  if (sorted.length === 0) return 0;
  let last = sorted[0]?.material ?? '';
  let changes = 0;
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i]?.material;
    if (current !== undefined && current !== last) {
      changes++;
      last = current;
    }
  }
  return changes;
}
