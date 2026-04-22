// Conduit damage to hostile underwater mobs. While active, a conduit
// deals 4 HP every 2 seconds to drowned/guardians/elder-guardians within
// the conduit's radius.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ConduitTarget {
  id: number;
  position: Vec3;
  kind: string;
}

const HOSTILE_KINDS = new Set(['drowned', 'guardian', 'elder_guardian']);
const ATTACK_INTERVAL_SEC = 2;
const ATTACK_DAMAGE = 4;

export interface ConduitAttackState {
  cooldownSec: number;
}

export function makeConduitAttackState(): ConduitAttackState {
  return { cooldownSec: 0 };
}

export interface ConduitAttackCtx {
  conduitPos: Vec3;
  radius: number;
  targets: readonly ConduitTarget[];
  dtSec: number;
}

export interface ConduitAttackResult {
  hits: readonly { id: number; damage: number }[];
}

export function tickConduitAttack(
  state: ConduitAttackState,
  ctx: ConduitAttackCtx,
): ConduitAttackResult {
  state.cooldownSec = Math.max(0, state.cooldownSec - ctx.dtSec);
  if (state.cooldownSec > 0) return { hits: [] };
  const hits: { id: number; damage: number }[] = [];
  for (const t of ctx.targets) {
    if (!HOSTILE_KINDS.has(t.kind)) continue;
    const dx = t.position.x - ctx.conduitPos.x;
    const dy = t.position.y - ctx.conduitPos.y;
    const dz = t.position.z - ctx.conduitPos.z;
    if (Math.hypot(dx, dy, dz) <= ctx.radius) {
      hits.push({ id: t.id, damage: ATTACK_DAMAGE });
    }
  }
  if (hits.length > 0) state.cooldownSec = ATTACK_INTERVAL_SEC;
  return { hits };
}
