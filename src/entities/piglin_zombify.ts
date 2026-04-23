export interface PiglinInOverworld {
  spawnTick: number;
  nowTick: number;
  dimension: 'overworld' | 'nether' | 'end';
  convertedFromShake: boolean;
}

export const ZOMBIFY_TIME_TICKS = 300;

export function shouldZombify(p: PiglinInOverworld): boolean {
  if (p.dimension === 'nether') return false;
  if (p.convertedFromShake) return true;
  return p.nowTick - p.spawnTick >= ZOMBIFY_TIME_TICKS;
}

export function shakeTimeTicks(): number {
  return 150;
}
