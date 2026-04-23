export interface VillageState {
  villagersCount: number;
  golemsNearby: number;
  recentlyAttacked: boolean;
  timeSinceLastRequest: number;
}

export const MIN_VILLAGERS_FOR_REQUEST = 3;
export const REQUEST_COOLDOWN_TICKS = 6000;

export function canRequestGolem(s: VillageState): boolean {
  if (s.villagersCount < MIN_VILLAGERS_FOR_REQUEST) return false;
  if (s.golemsNearby > 0) return false;
  if (s.timeSinceLastRequest < REQUEST_COOLDOWN_TICKS) return false;
  return s.recentlyAttacked;
}
