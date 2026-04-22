// Iron golem spawn from village. Triggers when a village has ≥10
// villagers + ≥20 beds + 1-min of threats (zombies nearby). Also spawnable
// by 4 iron blocks + carved pumpkin (the T formation).

export interface VillagerLike {
  position: { x: number; y: number; z: number };
  isWorking: boolean;
}

export interface GolemSpawnQuery {
  villagers: readonly VillagerLike[];
  bedCount: number;
  underThreat: boolean;
  existingGolems: number;
  dtSec: number;
  rng: () => number;
}

export interface GolemSpawnState {
  threatTimerSec: number;
}

export function makeGolemSpawnState(): GolemSpawnState {
  return { threatTimerSec: 0 };
}

export interface SpawnResult {
  shouldSpawn: boolean;
}

export function tickGolemSpawn(state: GolemSpawnState, q: GolemSpawnQuery): SpawnResult {
  const hasEnoughVillagers = q.villagers.length >= 10;
  const hasEnoughBeds = q.bedCount >= 20;
  if (!hasEnoughVillagers || !hasEnoughBeds) {
    state.threatTimerSec = 0;
    return { shouldSpawn: false };
  }
  if (q.existingGolems >= 10) return { shouldSpawn: false };
  if (!q.underThreat) {
    state.threatTimerSec = 0;
    return { shouldSpawn: false };
  }
  state.threatTimerSec += q.dtSec;
  if (state.threatTimerSec >= 60 && q.rng() < 0.3) {
    state.threatTimerSec = 0;
    return { shouldSpawn: true };
  }
  return { shouldSpawn: false };
}

// 4 iron blocks + carved pumpkin T detection.
export interface GolemConstructLookup {
  blockName(x: number, y: number, z: number): string;
}

export function detectIronGolemConstruct(
  origin: { x: number; y: number; z: number },
  lookup: GolemConstructLookup,
): boolean {
  const isIron = (x: number, y: number, z: number): boolean =>
    lookup.blockName(x, y, z) === 'webmc:iron_block';
  const isPumpkin = (x: number, y: number, z: number): boolean => {
    const n = lookup.blockName(x, y, z);
    return n === 'webmc:carved_pumpkin' || n === 'webmc:jack_o_lantern';
  };
  // Legs (2 iron), body (1 iron), arms (2 iron), head (pumpkin).
  if (!isIron(origin.x, origin.y, origin.z)) return false;
  if (!isIron(origin.x, origin.y + 1, origin.z)) return false;
  if (
    !isIron(origin.x - 1, origin.y + 2, origin.z) &&
    !isIron(origin.x + 1, origin.y + 2, origin.z)
  )
    return false;
  if (!isPumpkin(origin.x, origin.y + 3, origin.z)) return false;
  return true;
}
