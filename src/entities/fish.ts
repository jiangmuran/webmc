// Fish mobs: cod, salmon, tropical fish, pufferfish. Schooling behavior
// for cod/salmon (follow leader); pufferfish puffs when threatened and
// applies poison on contact.

export type FishKind = 'cod' | 'salmon' | 'tropical_fish' | 'pufferfish';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface FishState {
  id: number;
  kind: FishKind;
  position: Vec3;
  velocity: Vec3;
  health: number;
  secondsOutOfWater: number;
  puffStage: 0 | 1 | 2;
  schoolLeaderId: number | null;
}

const MAX_HEALTH_BY_KIND: Record<FishKind, number> = {
  cod: 3,
  salmon: 3,
  tropical_fish: 3,
  pufferfish: 3,
};

const OUT_OF_WATER_LETHAL_SEC = 15;
const PUFF_DISTANCE = 2;

export function makeFish(id: number, kind: FishKind, at: Vec3): FishState {
  return {
    id,
    kind,
    position: { ...at },
    velocity: { x: 0, y: 0, z: 0 },
    health: MAX_HEALTH_BY_KIND[kind],
    secondsOutOfWater: 0,
    puffStage: 0,
    schoolLeaderId: null,
  };
}

export interface FishTickCtx {
  inWater: boolean;
  nearestThreat: Vec3 | null;
  schoolMates: readonly FishState[];
  dtSec: number;
}

export interface FishTickResult {
  died: boolean;
  puffChanged: boolean;
}

export function tickFish(state: FishState, ctx: FishTickCtx): FishTickResult {
  if (state.health <= 0) return { died: true, puffChanged: false };
  if (!ctx.inWater) {
    state.secondsOutOfWater += ctx.dtSec;
    if (state.secondsOutOfWater >= OUT_OF_WATER_LETHAL_SEC) {
      state.health = 0;
      return { died: true, puffChanged: false };
    }
  } else {
    state.secondsOutOfWater = 0;
  }

  let puffChanged = false;
  if (state.kind === 'pufferfish' && ctx.nearestThreat) {
    const dx = ctx.nearestThreat.x - state.position.x;
    const dy = ctx.nearestThreat.y - state.position.y;
    const dz = ctx.nearestThreat.z - state.position.z;
    const dist = Math.hypot(dx, dy, dz);
    const newStage: 0 | 1 | 2 = dist < PUFF_DISTANCE ? 2 : dist < PUFF_DISTANCE * 2 ? 1 : 0;
    if (newStage !== state.puffStage) {
      state.puffStage = newStage;
      puffChanged = true;
    }
  }

  // Schooling: cod and salmon follow the nearest same-kind leader.
  if ((state.kind === 'cod' || state.kind === 'salmon') && !state.schoolLeaderId) {
    const leader = ctx.schoolMates.find((m) => m.kind === state.kind && m.id !== state.id);
    if (leader) state.schoolLeaderId = leader.id;
  }
  return { died: false, puffChanged };
}

// Hitting a puffed-stage-2 pufferfish applies poison for 5s.
export function pufferContactPoisonSeconds(stage: 0 | 1 | 2): number {
  if (stage === 2) return 5;
  if (stage === 1) return 3;
  return 0;
}

// Drops: pufferfish always drops 1 pufferfish item; others drop raw
// cod/salmon/etc.
export function fishDrops(kind: FishKind): { item: string; count: number }[] {
  switch (kind) {
    case 'cod':
      return [
        { item: 'webmc:cod', count: 1 },
        { item: 'webmc:bone_meal', count: Math.random() < 0.05 ? 1 : 0 },
      ].filter((d) => d.count > 0);
    case 'salmon':
      return [{ item: 'webmc:salmon', count: 1 }];
    case 'tropical_fish':
      return [{ item: 'webmc:tropical_fish', count: 1 }];
    case 'pufferfish':
      return [{ item: 'webmc:pufferfish', count: 1 }];
  }
}
