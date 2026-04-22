// Dimension coordinate scaling. Overworld ↔ Nether: 8:1.
// Overworld ↔ End: 1:1 (portal spawns at fixed spawn pad).

export type Dimension = 'overworld' | 'nether' | 'the_end';

export function overworldToNether(x: number): number {
  return Math.floor(x / 8);
}

export function netherToOverworld(x: number): number {
  return Math.floor(x * 8);
}

export function convert(from: Dimension, to: Dimension, coord: number): number {
  if (from === to) return coord;
  if (from === 'overworld' && to === 'nether') return overworldToNether(coord);
  if (from === 'nether' && to === 'overworld') return netherToOverworld(coord);
  return coord; // end is 1:1
}

export function endSpawnPad(): { x: number; y: number; z: number } {
  return { x: 100, y: 49, z: 0 };
}
