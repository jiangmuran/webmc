export function chunkKey(x: number, z: number): string {
  return `${x | 0},${z | 0}`;
}

export function parseKey(key: string): { x: number; z: number } | undefined {
  const parts = key.split(',');
  if (parts.length !== 2) return undefined;
  const a = parts[0];
  const b = parts[1];
  if (a === undefined || b === undefined) return undefined;
  const x = Number(a);
  const z = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(z)) return undefined;
  return { x, z };
}

export function keysInRange(cx: number, cz: number, radius: number): string[] {
  const out: string[] = [];
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      out.push(chunkKey(cx + dx, cz + dz));
    }
  }
  return out;
}
