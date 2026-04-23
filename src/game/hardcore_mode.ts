export interface HardcoreState {
  hardcore: boolean;
  playerDied: boolean;
}

export function becomesSpectatorOnDeath(s: HardcoreState): boolean {
  return s.hardcore && s.playerDied;
}

export function canRespawn(s: HardcoreState): boolean {
  return !(s.hardcore && s.playerDied);
}

export function worldDifficultyLocked(s: HardcoreState): boolean {
  return s.hardcore;
}

export function heartSkinIsHardcore(s: HardcoreState): boolean {
  return s.hardcore;
}
