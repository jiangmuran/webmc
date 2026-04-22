// Spawn validation. Rules: (1) surface block solid, (2) 2 air blocks
// above, (3) correct light level per category (hostile ≤ 7, passive ≥ 9
// skylight for plains), (4) not within 24 blocks of any player for
// natural spawn.

export type SpawnCategory = 'hostile' | 'passive' | 'ambient' | 'water';

export interface SpawnRulesQuery {
  category: SpawnCategory;
  blockLightAtSpawn: number;
  skyLightAtSpawn: number;
  belowIsSolid: boolean;
  aboveTwoAir: boolean;
  playerWithin24Blocks: boolean;
  playerWithin128Blocks: boolean;
  inWater: boolean;
}

export interface SpawnRulesResult {
  allowed: boolean;
  reason?: string;
}

export function canSpawnAt(q: SpawnRulesQuery): SpawnRulesResult {
  if (!q.playerWithin128Blocks) return { allowed: false, reason: 'no_player_in_range' };
  if (q.playerWithin24Blocks) return { allowed: false, reason: 'too_close_to_player' };
  if (!q.aboveTwoAir) return { allowed: false, reason: 'no_headroom' };
  if (q.category === 'water') {
    if (!q.inWater) return { allowed: false, reason: 'needs_water' };
    return { allowed: true };
  }
  if (!q.belowIsSolid) return { allowed: false, reason: 'no_ground' };
  if (q.category === 'hostile') {
    if (q.blockLightAtSpawn > 0 || q.skyLightAtSpawn > 7) {
      return { allowed: false, reason: 'too_bright' };
    }
    return { allowed: true };
  }
  if (q.category === 'passive') {
    if (q.skyLightAtSpawn < 9) return { allowed: false, reason: 'too_dark' };
    return { allowed: true };
  }
  // ambient (bats etc.)
  if (q.skyLightAtSpawn >= 4) return { allowed: false, reason: 'too_bright_ambient' };
  return { allowed: true };
}
