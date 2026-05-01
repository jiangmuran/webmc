// Pillager crossbow reload. Pillagers carry a crossbow and cycle
// between shooting and reloading.
//
// Wiki (minecraft.wiki/w/Pillager): "A pillager attacks by shooting
// arrows from its crossbow every three seconds from up to eight
// blocks away." Total cycle: 60 ticks = 3 seconds = reload (25
// ticks per crossbow charge, wiki) + post-shot pause (35 ticks).
// Old SHOT_COOLDOWN_TICKS = 20 (1 s) gave a 45-tick (2.25 s) cycle
// — pillagers fired ~33% faster than wiki canon. Captain pillagers
// keep their faster 20-tick reload (raid-leader buff).

export type PillagerRole = 'normal' | 'captain';

export interface PillagerState {
  role: PillagerRole;
  loaded: boolean;
  reloadTicksRemaining: number;
  postShotCooldownTicks: number;
}

export function makePillager(role: PillagerRole = 'normal'): PillagerState {
  return {
    role,
    loaded: false,
    reloadTicksRemaining: 25,
    postShotCooldownTicks: 0,
  };
}

const RELOAD_DURATION_TICKS = 25;
const CAPTAIN_RELOAD_DURATION_TICKS = 20;
// Wiki: 3-second total cycle ÷ 25-tick reload = 35-tick post-shot pause.
const SHOT_COOLDOWN_TICKS = 35;

export interface PillagerTickCtx {
  hasTarget: boolean;
  inLineOfSight: boolean;
}

export interface PillagerTickResult {
  shot: boolean;
  reloading: boolean;
}

export function tickPillagerCrossbow(
  state: PillagerState,
  ctx: PillagerTickCtx,
): PillagerTickResult {
  if (state.postShotCooldownTicks > 0) {
    state.postShotCooldownTicks--;
    return { shot: false, reloading: false };
  }
  if (!state.loaded) {
    const reloadDuration =
      state.role === 'captain' ? CAPTAIN_RELOAD_DURATION_TICKS : RELOAD_DURATION_TICKS;
    state.reloadTicksRemaining--;
    if (state.reloadTicksRemaining <= 0) {
      state.loaded = true;
      state.reloadTicksRemaining = reloadDuration;
    }
    return { shot: false, reloading: true };
  }
  if (!ctx.hasTarget || !ctx.inLineOfSight) {
    return { shot: false, reloading: false };
  }
  state.loaded = false;
  state.postShotCooldownTicks = SHOT_COOLDOWN_TICKS;
  return { shot: true, reloading: false };
}

// Captain patrols spawn 1 captain + 3-5 normal pillagers. They path
// toward a randomly-chosen nearby village.
export interface PatrolConfig {
  leaderBadge: string; // banner on head
  minGroupSize: number;
  maxGroupSize: number;
  seekVillageRadius: number;
}

export const PATROL_DEFAULTS: PatrolConfig = {
  leaderBadge: 'webmc:ominous_banner',
  minGroupSize: 3,
  maxGroupSize: 5,
  seekVillageRadius: 500,
};

// Killing a captain applies Bad Omen to the killer.
export const BAD_OMEN_DURATION_SEC = 100 * 60; // 100 minutes
