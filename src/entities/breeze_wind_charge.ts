// Breeze wind-charge projectile. Arcs toward the target, explodes on
// contact with an AOE push + wind_charged effect. Deals 1 damage directly;
// real threat is launching the player off ledges.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface WindChargeProjectile {
  id: number;
  position: Vec3;
  velocity: Vec3;
  ageSec: number;
}

const DIRECT_DAMAGE = 1;
const EXPLOSION_RADIUS = 1.5;
const PUSH_MAGNITUDE = 1.2;

export function makeWindCharge(
  id: number,
  from: Vec3,
  dir: Vec3,
  speed: number,
): WindChargeProjectile {
  const mag = Math.hypot(dir.x, dir.y, dir.z) || 1;
  return {
    id,
    position: { ...from },
    velocity: { x: (dir.x / mag) * speed, y: (dir.y / mag) * speed, z: (dir.z / mag) * speed },
    ageSec: 0,
  };
}

export interface WindChargeTickCtx {
  isSolid: (x: number, y: number, z: number) => boolean;
  dtSec: number;
}

export interface WindChargeResult {
  exploded: boolean;
  explosionCenter: Vec3 | null;
}

// Arrow-like travel; explodes on first solid block contact or after 3s.
const MAX_LIFETIME_SEC = 3;

export function tickWindCharge(p: WindChargeProjectile, ctx: WindChargeTickCtx): WindChargeResult {
  p.ageSec += ctx.dtSec;
  p.position.x += p.velocity.x * ctx.dtSec;
  p.position.y += p.velocity.y * ctx.dtSec;
  p.position.z += p.velocity.z * ctx.dtSec;
  if (p.ageSec >= MAX_LIFETIME_SEC) {
    return { exploded: true, explosionCenter: { ...p.position } };
  }
  if (ctx.isSolid(Math.floor(p.position.x), Math.floor(p.position.y), Math.floor(p.position.z))) {
    return { exploded: true, explosionCenter: { ...p.position } };
  }
  return { exploded: false, explosionCenter: null };
}

// Given a list of entities in the blast radius, compute the push
// velocity delta each should receive (proportional to 1 - d/R).
export interface WindChargeTarget {
  id: number;
  position: Vec3;
}

export interface PushDelta {
  id: number;
  dv: Vec3;
  directDamage: number;
}

export function computeWindChargePushes(
  center: Vec3,
  targets: readonly WindChargeTarget[],
): PushDelta[] {
  const out: PushDelta[] = [];
  for (const t of targets) {
    const dx = t.position.x - center.x;
    const dy = t.position.y - center.y;
    const dz = t.position.z - center.z;
    const d = Math.hypot(dx, dy, dz);
    if (d > EXPLOSION_RADIUS) continue;
    const falloff = 1 - d / EXPLOSION_RADIUS;
    const mag = PUSH_MAGNITUDE * falloff;
    const dir = d === 0 ? { x: 0, y: 1, z: 0 } : { x: dx / d, y: dy / d, z: dz / d };
    out.push({
      id: t.id,
      dv: { x: dir.x * mag, y: dir.y * mag, z: dir.z * mag },
      directDamage: d === 0 ? DIRECT_DAMAGE : 0,
    });
  }
  return out;
}
