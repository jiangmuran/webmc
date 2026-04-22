// Crossbow charging state machine. Pulling begins charging; release
// after CHARGE_MS latches the bow into CHARGED. A charged crossbow
// can be fired instantly (unlike bow). Quick Charge enchantment
// reduces the charge time by (level * 0.25s), min 0.25s.

export type CrossbowPhase = 'idle' | 'charging' | 'charged';

export interface CrossbowState {
  phase: CrossbowPhase;
  chargeStartMs: number;
  ammo: 'none' | 'arrow' | 'firework';
}

export const BASE_CHARGE_MS = 1250;

export function makeCrossbow(): CrossbowState {
  return { phase: 'idle', chargeStartMs: 0, ammo: 'none' };
}

export function chargeTimeMs(quickChargeLevel: number): number {
  const reduced = BASE_CHARGE_MS - quickChargeLevel * 250;
  return Math.max(250, reduced);
}

export interface BeginQuery {
  nowMs: number;
  ammo: 'arrow' | 'firework';
}

export function beginCharge(s: CrossbowState, q: BeginQuery): boolean {
  if (s.phase !== 'idle') return false;
  s.phase = 'charging';
  s.chargeStartMs = q.nowMs;
  s.ammo = q.ammo;
  return true;
}

export interface ReleaseQuery {
  nowMs: number;
  quickChargeLevel: number;
}

export function releaseCharge(s: CrossbowState, q: ReleaseQuery): 'charged' | 'cancelled' {
  if (s.phase !== 'charging') return 'cancelled';
  const elapsed = q.nowMs - s.chargeStartMs;
  if (elapsed >= chargeTimeMs(q.quickChargeLevel)) {
    s.phase = 'charged';
    return 'charged';
  }
  s.phase = 'idle';
  s.ammo = 'none';
  return 'cancelled';
}

export function fire(s: CrossbowState): 'arrow' | 'firework' | null {
  if (s.phase !== 'charged') return null;
  const a = s.ammo === 'none' ? null : s.ammo;
  s.phase = 'idle';
  s.ammo = 'none';
  return a;
}
