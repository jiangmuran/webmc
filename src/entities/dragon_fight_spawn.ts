// Ender Dragon fight spawn & respawn. On first entry, a dragon and
// 10 end crystal pillars spawn. Dragon respawns when 4 end crystals
// are placed in a square on the exit portal.

export const PILLAR_COUNT = 10;
export const RESPAWN_CRYSTALS = 4;

export interface EndFightState {
  dragonAlive: boolean;
  pillarsStanding: number; // 0..10
  dragonRespawning: boolean;
  respawnCrystalsPlaced: number; // 0..4
}

export function initialFight(): EndFightState {
  return {
    dragonAlive: true,
    pillarsStanding: PILLAR_COUNT,
    dragonRespawning: false,
    respawnCrystalsPlaced: 0,
  };
}

export function destroyPillar(s: EndFightState): void {
  if (s.pillarsStanding > 0) s.pillarsStanding -= 1;
}

export function dragonHasHealBeam(s: EndFightState): boolean {
  return s.dragonAlive && s.pillarsStanding > 0;
}

export function dragonDies(s: EndFightState): void {
  s.dragonAlive = false;
}

export type PlaceResult = 'placed' | 'complete' | 'already_respawning' | 'dragon_alive';

export function placeResurrectCrystal(s: EndFightState): PlaceResult {
  if (s.dragonAlive) return 'dragon_alive';
  if (s.dragonRespawning) return 'already_respawning';
  s.respawnCrystalsPlaced += 1;
  if (s.respawnCrystalsPlaced >= RESPAWN_CRYSTALS) {
    s.dragonRespawning = true;
    return 'complete';
  }
  return 'placed';
}

export function completeRespawn(s: EndFightState): void {
  if (!s.dragonRespawning) return;
  s.dragonAlive = true;
  s.dragonRespawning = false;
  s.respawnCrystalsPlaced = 0;
  s.pillarsStanding = PILLAR_COUNT;
}
