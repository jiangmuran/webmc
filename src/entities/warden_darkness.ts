// Warden darkness effect. Emitted in a 20-block radius around a Warden;
// inflicts a pulsing Blindness-like effect on players.
//
// Wiki (minecraft.wiki/w/Warden#Inflicting_Darkness): "A warden,
// whether angered or not, gives 13 seconds of Darkness to all
// players within a 20 block ovoid radius of it every 6 seconds."
// Old EFFECT_DURATION_SEC = 12 was 1 s short of the wiki value
// (12 s is the SCULK SHRIEKER post-shriek darkness duration —
// different source). webmc files-warden uses 13 s.

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
const EFFECT_DURATION_SEC = 13;

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
