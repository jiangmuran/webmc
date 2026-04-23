export const MAX_EGGS = 4;
export type Hatch = 0 | 1 | 2;

export interface TurtleEggBlock {
  eggs: 1 | 2 | 3 | 4;
  hatch: Hatch;
  onSand: boolean;
  skyLightLevel: number;
}

export function isNightAdvanceable(
  e: TurtleEggBlock,
  isNight: boolean,
  rng: () => number,
): boolean {
  if (!e.onSand) return false;
  if (!isNight) return false;
  return rng() < 0.1;
}

export function advance(e: TurtleEggBlock): TurtleEggBlock {
  if (e.hatch >= 2) return e;
  return { ...e, hatch: (e.hatch + 1) as Hatch };
}

export function readyToHatch(e: TurtleEggBlock): boolean {
  return e.hatch >= 2;
}

export function stompChance(wasSprinting: boolean): number {
  return wasSprinting ? 1 / 3 : 1 / 500;
}
