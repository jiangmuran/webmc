export interface RiptideInput {
  riptideLevel: 0 | 1 | 2 | 3;
  inWater: boolean;
  inRain: boolean;
  chargeTicks: number;
}

export const MIN_CHARGE = 10;

export function canLaunch(i: RiptideInput): boolean {
  if (i.riptideLevel === 0) return false;
  if (i.chargeTicks < MIN_CHARGE) return false;
  return i.inWater || i.inRain;
}

export function launchSpeed(level: 1 | 2 | 3): number {
  return 3 + level * 1.8;
}

export function conflictsWithLoyalty(riptideLevel: number): boolean {
  return riptideLevel > 0;
}
