export interface CompassInput {
  playerX: number;
  playerZ: number;
  targetX: number;
  targetZ: number;
  playerYaw: number;
  worldDimensionMatches: boolean;
}

export function needleAngle(i: CompassInput): number {
  if (!i.worldDimensionMatches) {
    return Math.random() * Math.PI * 2;
  }
  const world = Math.atan2(i.targetX - i.playerX, -(i.targetZ - i.playerZ));
  const diff = world - i.playerYaw;
  return Math.atan2(Math.sin(diff), Math.cos(diff));
}

export function lodestoneLocked(lodestonePos?: { x: number; y: number; z: number }): boolean {
  return lodestonePos !== undefined;
}
