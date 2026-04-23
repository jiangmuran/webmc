export interface PillarPos {
  x: number;
  z: number;
}

export const PILLAR_COUNT = 10;

export function respawnPatternValid(
  pillars: readonly PillarPos[],
  crystalsOnEach: readonly boolean[],
): boolean {
  if (pillars.length !== PILLAR_COUNT) return false;
  if (crystalsOnEach.length !== PILLAR_COUNT) return false;
  return crystalsOnEach.every((c) => c);
}

export function endCrystalBasePositions(cx: number, cz: number): readonly PillarPos[] {
  return [
    { x: cx - 3, z: cz },
    { x: cx + 3, z: cz },
    { x: cx, z: cz - 3 },
    { x: cx, z: cz + 3 },
  ];
}
