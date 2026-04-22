// Warden darkness effect. Emitted in a 20-block radius around a Warden
// (or sculk shrieker warning); inflicts a pulsing Blindness-like effect
// on players.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface DarknessTarget {
  id: number;
  position: Vec3;
}

const EFFECT_RADIUS = 20;
const EFFECT_DURATION_SEC = 12;

export interface DarknessApply {
  entityId: number;
  effectDurationSec: number;
}

export function applyDarknessAround(
  source: Vec3,
  targets: readonly DarknessTarget[],
): DarknessApply[] {
  const out: DarknessApply[] = [];
  for (const t of targets) {
    const dx = t.position.x - source.x;
    const dy = t.position.y - source.y;
    const dz = t.position.z - source.z;
    if (Math.hypot(dx, dy, dz) > EFFECT_RADIUS) continue;
    out.push({ entityId: t.id, effectDurationSec: EFFECT_DURATION_SEC });
  }
  return out;
}
