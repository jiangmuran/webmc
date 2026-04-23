export const SEA_LANTERN_LIGHT_LEVEL = 15;

export function emitsLight(): number {
  return SEA_LANTERN_LIGHT_LEVEL;
}

export function prismarineCrystalsDropped(rng: () => number): number {
  return 2 + Math.floor(rng() * 3);
}

export function silkTouchDropsSelf(): boolean {
  return true;
}
