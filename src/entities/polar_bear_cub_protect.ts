export interface PolarBear {
  hasCubNearby: boolean;
  isAdult: boolean;
  playerDamagedIt: boolean;
}

export function isHostile(b: PolarBear): boolean {
  if (!b.isAdult) return false;
  if (b.playerDamagedIt) return true;
  return b.hasCubNearby;
}

export function cubDefendRange(): number {
  return 16;
}
