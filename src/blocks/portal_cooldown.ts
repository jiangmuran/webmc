export interface Entity {
  lastPortalTick: number;
  isPlayer: boolean;
}

export const PLAYER_COOLDOWN = 300;
export const MOB_COOLDOWN = 900;

export function cooldownTicks(e: Entity): number {
  return e.isPlayer ? PLAYER_COOLDOWN : MOB_COOLDOWN;
}

export function canTravelAgain(e: Entity, nowTick: number): boolean {
  return nowTick - e.lastPortalTick >= cooldownTicks(e);
}
