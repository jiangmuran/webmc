// Conduit damage to hostile underwater mobs. While active, a conduit
// deals 4 HP every 2 seconds to drowned/guardians/elder-guardians
// within an 8-block radius — fixed regardless of activation frame
// size.
//
// Wiki (minecraft.wiki/w/Conduit#Mechanics): "Hostile mobs (drowned,
// guardians, and elder guardians) within an 8-block range of an
// active conduit take 4 damage every 2 seconds. This range is fixed,
// unlike the Conduit Power buff range which scales 32-96 with the
// activation frame."
//
// Callers may still pass ctx.radius (e.g. when reusing the conduit's
// expanded power radius), but it is clamped to the wiki-canonical 8
// blocks; otherwise an active conduit with a large frame would
// damage hostile mobs out to 96 blocks, ~12× the wiki value.

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
export const CONDUIT_DAMAGE_RADIUS = 8;

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
  // Wiki: damage range is fixed at 8 blocks regardless of conduit
  // power range. Clamp ctx.radius to that ceiling.
  const effectiveRadius = Math.min(CONDUIT_DAMAGE_RADIUS, ctx.radius);
  const hits: { id: number; damage: number }[] = [];
  for (const t of ctx.targets) {
    if (!HOSTILE_KINDS.has(t.kind)) continue;
    const dx = t.position.x - ctx.conduitPos.x;
    const dy = t.position.y - ctx.conduitPos.y;
    const dz = t.position.z - ctx.conduitPos.z;
    if (Math.hypot(dx, dy, dz) <= effectiveRadius) {
      hits.push({ id: t.id, damage: ATTACK_DAMAGE });
    }
  }
  if (hits.length > 0) state.cooldownSec = ATTACK_INTERVAL_SEC;
  return { hits };
}
