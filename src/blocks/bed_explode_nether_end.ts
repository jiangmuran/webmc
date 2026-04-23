export type Dimension = 'overworld' | 'nether' | 'end';

export function explodesOnSleep(dim: Dimension): boolean {
  return dim !== 'overworld';
}

export const BED_EXPLOSION_POWER = 5;

export function explosionPower(dim: Dimension): number {
  return explodesOnSleep(dim) ? BED_EXPLOSION_POWER : 0;
}
