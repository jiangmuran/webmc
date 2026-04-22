// Iron golem combat. Protects villagers; attacks hostile mobs in a 16-
// block radius with a swinging arm that launches targets up 0.4 + random
// (0, 0.4). Damage range: 7.5–21.5 HP depending on the golem's attack
// attribute.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const GOLEM_MAX_HEALTH = 100;

export interface GolemState {
  id: number;
  position: Vec3;
  health: number;
  attackCooldownTicks: number;
  targetId: number | null;
}

export function makeIronGolem(id: number, at: Vec3): GolemState {
  return {
    id,
    position: { ...at },
    health: GOLEM_MAX_HEALTH,
    attackCooldownTicks: 0,
    targetId: null,
  };
}

const ATTACK_COOLDOWN_TICKS = 20; // 1s
export const GOLEM_DETECT_RADIUS = 16;

export interface GolemAttackCtx {
  target: { id: number; position: Vec3 } | null;
  rng: () => number;
}

export interface GolemAttackResult {
  hit: boolean;
  damage: number;
  launchY: number;
}

export function tryAttack(state: GolemState, ctx: GolemAttackCtx): GolemAttackResult {
  if (state.attackCooldownTicks > 0) {
    state.attackCooldownTicks--;
    return { hit: false, damage: 0, launchY: 0 };
  }
  if (!ctx.target) return { hit: false, damage: 0, launchY: 0 };
  const dx = ctx.target.position.x - state.position.x;
  const dy = ctx.target.position.y - state.position.y;
  const dz = ctx.target.position.z - state.position.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist > 2.5) return { hit: false, damage: 0, launchY: 0 };
  state.attackCooldownTicks = ATTACK_COOLDOWN_TICKS;
  const damage = 7.5 + ctx.rng() * 14;
  const launchY = 0.4 + ctx.rng() * 0.4;
  return { hit: true, damage, launchY };
}

// Golems take reduced damage from non-player sources (0.5×); full damage
// from players.
export function damageGolem(state: GolemState, amount: number, fromPlayer: boolean): number {
  const actual = fromPlayer ? amount : amount * 0.5;
  state.health = Math.max(0, state.health - actual);
  return actual;
}

// Iron ingot heals the golem by 25 HP.
export const IRON_INGOT_HEAL = 25;

export function feedIronIngot(state: GolemState): number {
  const before = state.health;
  state.health = Math.min(GOLEM_MAX_HEALTH, state.health + IRON_INGOT_HEAL);
  return state.health - before;
}
