// Explosion block drops. Only blocks with resistance ≤ power leave
// drops, and only by chance = 1/power.

export interface BlockEntry {
  id: string;
  blastResistance: number;
}

export function destroyed(b: BlockEntry, power: number): boolean {
  return b.blastResistance <= power;
}

export function dropsAfterBlast(b: BlockEntry, power: number, rand: () => number): boolean {
  if (!destroyed(b, power)) return false;
  return rand() < 1 / power;
}

// Charged creeper + explosion yields mob heads (from skeleton/zombie/creeper).
export function dropsMobHead(killedBy: string, victim: string): boolean {
  if (killedBy !== 'charged_creeper') return false;
  return (
    victim === 'skeleton' ||
    victim === 'zombie' ||
    victim === 'creeper' ||
    victim === 'wither_skeleton'
  );
}
