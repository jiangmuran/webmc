// Elder guardian. Periodically applies Mining Fatigue III to every
// player within 50 blocks for 5 minutes. Effect re-applies every 1 min.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const AURA_RADIUS = 50;
const REFRESH_INTERVAL_SEC = 60;
const FATIGUE_DURATION_SEC = 300;

export interface ElderAuraState {
  cooldownSec: number;
}

export function makeElderAura(): ElderAuraState {
  return { cooldownSec: 0 };
}

export interface AuraTarget {
  id: number;
  position: Vec3;
}

export interface AuraApply {
  entityId: number;
  durationSec: number;
  amplifier: number;
}

export interface AuraTickCtx {
  elderPos: Vec3;
  players: readonly AuraTarget[];
  dtSec: number;
}

export function tickElderAura(state: ElderAuraState, ctx: AuraTickCtx): AuraApply[] {
  state.cooldownSec = Math.max(0, state.cooldownSec - ctx.dtSec);
  if (state.cooldownSec > 0) return [];
  const out: AuraApply[] = [];
  for (const p of ctx.players) {
    const dx = p.position.x - ctx.elderPos.x;
    const dy = p.position.y - ctx.elderPos.y;
    const dz = p.position.z - ctx.elderPos.z;
    if (Math.hypot(dx, dy, dz) > AURA_RADIUS) continue;
    out.push({
      entityId: p.id,
      durationSec: FATIGUE_DURATION_SEC,
      amplifier: 2, // Mining Fatigue III
    });
  }
  state.cooldownSec = REFRESH_INTERVAL_SEC;
  return out;
}
