// Wiki (minecraft.wiki/w/Villager#Profession): "If a villager who
// has never traded loses access to its workstation, it loses its
// profession after a short delay. Once a villager has traded with a
// player, it keeps its profession even if the workstation is
// destroyed."
//
// So abandon splits by trade-history:
//   - !hasTraded && workstation gone → abandon after delay
//   - hasTraded && workstation gone → KEEP profession (no abandon)
//
// Old code returned true after the lockout regardless of trade
// history, which would make a workstation-broken master librarian
// lose its profession after 10 min — but wiki says that villager
// never abandons.
export const TRADE_LOCKOUT_TICKS = 20 * 60 * 10;

export interface Employment {
  profession: string;
  hasTradedAtLeastOnce: boolean;
  workstationDestroyedAtTick?: number;
}

export function shouldAbandon(
  e: Employment,
  workstationExists: boolean,
  currentTick: number,
): boolean {
  if (workstationExists) return false;
  if (e.workstationDestroyedAtTick === undefined) return false;
  // Wiki: traded villagers retain their profession indefinitely.
  if (e.hasTradedAtLeastOnce) return false;
  return currentTick - e.workstationDestroyedAtTick >= TRADE_LOCKOUT_TICKS;
}

export function retainsLevelIfTraded(e: Employment): boolean {
  return e.hasTradedAtLeastOnce;
}
