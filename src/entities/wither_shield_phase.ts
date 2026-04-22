// Wither boss. 300 HP. First 5 seconds invulnerable while charging.
// Half HP triggers "armored" phase (wither armor); bullets replaced
// with blue wither skulls that pierce blocks.

export type WitherPhase = 'charging' | 'normal' | 'armored' | 'dead';

export interface Wither {
  hp: number;
  maxHp: number;
  phase: WitherPhase;
  spawnTick: number;
}

export const MAX_HP = 300;
export const CHARGE_TICKS = 220;
export const ARMORED_THRESHOLD = 0.5;

export function makeWither(spawnTick: number): Wither {
  return { hp: 1, maxHp: MAX_HP, phase: 'charging', spawnTick };
}

export function tickPhase(w: Wither, nowTick: number): void {
  if (w.hp <= 0) {
    w.phase = 'dead';
    return;
  }
  if (w.phase === 'charging') {
    const t = nowTick - w.spawnTick;
    const target = Math.min(MAX_HP, Math.floor((t / CHARGE_TICKS) * MAX_HP));
    w.hp = Math.max(w.hp, target);
    if (t >= CHARGE_TICKS) {
      w.hp = MAX_HP;
      w.phase = 'normal';
    }
    return;
  }
  if (w.phase === 'normal' && w.hp <= w.maxHp * ARMORED_THRESHOLD) {
    w.phase = 'armored';
  }
}

export interface DamageQuery {
  amount: number;
  fromExplosion: boolean;
}

export function damageWither(w: Wither, q: DamageQuery): number {
  if (w.phase === 'charging') return 0; // invulnerable
  if (w.phase === 'armored' && q.fromExplosion) return 0;
  const take = q.amount;
  w.hp = Math.max(0, w.hp - take);
  return take;
}

// Skull: damage + wither-effect; armored skulls pierce air + weak
// blocks (omitted here).
export const SKULL_DAMAGE = 8;
export const WITHER_EFFECT_TICKS = 200;
