// Creaking heart (Pale Garden, 1.21.4). Spawns a Creaking hostile mob at
// night from within 32 blocks of the heart; the Creaking is immortal while
// its heart lives, and can't move while being watched.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface CreakingHeartState {
  pos: Vec3;
  active: boolean;
  boundCreakingId: number | null;
}

export function makeCreakingHeart(pos: Vec3): CreakingHeartState {
  return { pos: { ...pos }, active: false, boundCreakingId: null };
}

export interface HeartQuery {
  timeOfDay: number;
  playerNearby: boolean;
}

// MC: hearts spawn Creaking at night when a player's near and no Creaking
// is already bound.
export function shouldSpawnCreaking(heart: CreakingHeartState, q: HeartQuery): boolean {
  if (heart.boundCreakingId !== null) return false;
  if (!q.playerNearby) return false;
  const isNight = q.timeOfDay >= 13000 && q.timeOfDay <= 23000;
  return isNight;
}

export function bindCreaking(state: CreakingHeartState, creakingId: number): void {
  state.boundCreakingId = creakingId;
  state.active = true;
}

export function clearCreaking(state: CreakingHeartState): void {
  state.boundCreakingId = null;
  state.active = false;
}

// Breaking the heart damages the bound Creaking; destroying the heart
// dissolves it.
export interface DamageQuery {
  amount: number;
}

export interface DamageResult {
  heartDestroyed: boolean;
  creakingDamage: number;
}

export function damageHeart(_state: CreakingHeartState, q: DamageQuery): DamageResult {
  void _state;
  return {
    heartDestroyed: q.amount >= 12,
    creakingDamage: q.amount,
  };
}
