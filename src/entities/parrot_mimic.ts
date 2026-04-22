// Parrots. Tame with seeds; shoulder-perch when interacted. Parrots
// periodically mimic nearby hostile mobs' sounds, and dance near an
// active jukebox (within 3 blocks).

export type ParrotVariant = 'red_blue' | 'blue' | 'green' | 'yellow_blue' | 'gray';

export const PARROT_VARIANTS: readonly ParrotVariant[] = [
  'red_blue',
  'blue',
  'green',
  'yellow_blue',
  'gray',
];

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ParrotState {
  id: number;
  variant: ParrotVariant;
  position: Vec3;
  tamed: boolean;
  ownerId: string | null;
  onShoulder: boolean;
  dancing: boolean;
}

export function makeParrot(id: number, variant: ParrotVariant, at: Vec3): ParrotState {
  return {
    id,
    variant,
    position: { ...at },
    tamed: false,
    ownerId: null,
    onShoulder: false,
    dancing: false,
  };
}

// Tame roll: seeds have 1/3 chance of taming per feed.
export function tryTame(state: ParrotState, ownerId: string, roll: number): boolean {
  if (state.tamed) return false;
  if (roll < 1 / 3) {
    state.tamed = true;
    state.ownerId = ownerId;
    return true;
  }
  return false;
}

export interface MimicCtx {
  nearbyHostileMob: string | null;
  roll: number; // per-tick
}

// 1/200 per tick to mimic nearby hostile. Returns the mimicked sound id.
export function tickMimic(ctx: MimicCtx): string | null {
  if (!ctx.nearbyHostileMob) return null;
  if (ctx.roll >= 1 / 200) return null;
  return `webmc:mob.${ctx.nearbyHostileMob}.ambient_imitated`;
}

// Dance if within 3 blocks of a playing jukebox.
export interface DanceCtx {
  nearestJukebox: Vec3 | null;
}

export function updateDancing(state: ParrotState, ctx: DanceCtx): boolean {
  if (!ctx.nearestJukebox) {
    state.dancing = false;
    return false;
  }
  const dx = ctx.nearestJukebox.x - state.position.x;
  const dy = ctx.nearestJukebox.y - state.position.y;
  const dz = ctx.nearestJukebox.z - state.position.z;
  state.dancing = Math.hypot(dx, dy, dz) <= 3;
  return state.dancing;
}

// Cookies are poison to parrots — damage them instantly on feed.
export function feedCookie(_state: ParrotState): { damage: number; killed: boolean } {
  return { damage: 999, killed: true };
}
