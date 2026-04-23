export interface Mob {
  type: string;
  lastHitByPlayerTicks?: number;
}

export const XP_TABLE: Record<string, number> = {
  zombie: 5,
  skeleton: 5,
  creeper: 5,
  spider: 5,
  cave_spider: 5,
  husk: 5,
  stray: 5,
  drowned: 5,
  blaze: 10,
  ghast: 5,
  witch: 5,
  pillager: 5,
  ravager: 20,
  vindicator: 5,
  evoker: 10,
  warden: 5,
  wither: 50,
  ender_dragon: 12000,
  villager: 0,
  pig: 1,
  cow: 1,
  sheep: 1,
  chicken: 1,
};

export const PLAYER_KILL_WINDOW_TICKS = 100;

export function dropsXp(m: Mob): number {
  if (m.lastHitByPlayerTicks === undefined) return 0;
  if (m.lastHitByPlayerTicks > PLAYER_KILL_WINDOW_TICKS) return 0;
  return XP_TABLE[m.type] ?? 0;
}
