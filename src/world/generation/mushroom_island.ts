export const MAX_TORCHLESS_SPAWN_LIGHT = 15;

export function mobSpawnAllowed(mob: string): boolean {
  return mob === 'mooshroom';
}

export function surfaceBlock(y: number, seaLevel: number): string {
  if (y < seaLevel) return 'dirt';
  return 'mycelium';
}

export function huge_mushroom_count(rng: () => number): number {
  return 2 + Math.floor(rng() * 3);
}
