// Squid + glow squid. Passive ocean mobs that swim and release ink when
// attacked. Glow squid drops glow ink sacs (used for glow item frames,
// signs, and the glow effect on entities).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type SquidKind = 'squid' | 'glow_squid';

export interface SquidState {
  id: number;
  kind: SquidKind;
  position: Vec3;
  velocity: Vec3;
  health: number;
  ticksSinceInk: number;
}

export const SQUID_MAX_HEALTH = 10;
const INK_COOLDOWN_TICKS = 100;

export function makeSquid(id: number, kind: SquidKind, at: Vec3): SquidState {
  return {
    id,
    kind,
    position: { ...at },
    velocity: { x: 0, y: 0, z: 0 },
    health: SQUID_MAX_HEALTH,
    ticksSinceInk: INK_COOLDOWN_TICKS,
  };
}

export interface SquidHitResult {
  inkReleased: boolean;
  inkKind: 'ink_sac' | 'glow_ink_sac' | null;
}

export function onSquidHit(state: SquidState): SquidHitResult {
  if (state.ticksSinceInk < INK_COOLDOWN_TICKS) {
    return { inkReleased: false, inkKind: null };
  }
  state.ticksSinceInk = 0;
  return {
    inkReleased: true,
    inkKind: state.kind === 'glow_squid' ? 'glow_ink_sac' : 'ink_sac',
  };
}

export function tickSquid(state: SquidState): void {
  state.ticksSinceInk = Math.min(INK_COOLDOWN_TICKS, state.ticksSinceInk + 1);
}

// Glow squid: lights its immediate area (not as a block, but as an ambient
// entity glow). Emit an "entity glow" signal when alive.
export function glowSquidEmitsLight(state: SquidState): boolean {
  return state.kind === 'glow_squid' && state.health > 0;
}

// Drop table: 1-3 ink sacs (or glow ink sacs for glow squid).
export function squidDrops(
  state: SquidState,
  rng: () => number,
): { item: string; count: number }[] {
  const kind = state.kind === 'glow_squid' ? 'webmc:glow_ink_sac' : 'webmc:ink_sac';
  const count = 1 + Math.floor(rng() * 3); // 1..3
  return [{ item: kind, count }];
}
