// Chunk "inhabited time": total ticks any player has been within
// loading radius of this chunk. Influences local difficulty.

export interface ChunkStats {
  inhabitedTicks: number;
}

export function accrue(stats: ChunkStats, playersInRange: number): ChunkStats {
  if (playersInRange <= 0) return stats;
  return { inhabitedTicks: stats.inhabitedTicks + 1 };
}

// Local difficulty formula (simplified from MC): scales from 0..6.75.
export function localDifficulty(stats: ChunkStats, regionalBase: number): number {
  const hours = stats.inhabitedTicks / (3600 * 20);
  const timeFactor = Math.min(1, hours / 150); // cap near 150h
  return Math.max(0, Math.min(6.75, regionalBase + timeFactor * 3.75));
}

// Hostile mob equipment/enchant chance improves with local difficulty.
export function enchantArmorChance(localDiff: number): number {
  return Math.min(1, Math.max(0, (localDiff - 2) * 0.1));
}
