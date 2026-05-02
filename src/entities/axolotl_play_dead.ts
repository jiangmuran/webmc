// Axolotl play-dead. On damage, ~1/3 chance to play dead for 10s,
// gaining Regeneration I + Resistance I. Also gives nearby players
// regen after killing a mob.

export interface AxolotlState {
  hp: number;
  maxHp: number;
  playingDeadUntilMs: number;
  lastPlayDeadMs: number;
}

// Wiki (minecraft.wiki/w/Axolotl#Playing_dead): "After they play
// dead and revive, axolotls cannot play dead again for 5 minutes."
// Sibling axolotl.ts uses PLAY_DEAD_COOLDOWN = 5 * 60. Old 2-minute
// cooldown allowed the axolotl to spam play-dead 2.5× more often
// than wiki canon.
export const PLAY_DEAD_DURATION_MS = 10_000;
export const PLAY_DEAD_CHANCE = 0.333;
export const PLAY_DEAD_COOLDOWN_MS = 5 * 60_000;

export function makeAxolotl(maxHp = 14): AxolotlState {
  return {
    hp: maxHp,
    maxHp,
    playingDeadUntilMs: 0,
    lastPlayDeadMs: -Infinity,
  };
}

export interface DamageQuery {
  amount: number;
  inWater: boolean;
  nowMs: number;
  rand: () => number;
}

export function onDamage(a: AxolotlState, q: DamageQuery): boolean {
  a.hp = Math.max(0, a.hp - q.amount);
  if (!q.inWater) return false;
  if (q.nowMs < a.playingDeadUntilMs) return false;
  if (q.nowMs - a.lastPlayDeadMs < PLAY_DEAD_COOLDOWN_MS) return false;
  if (q.rand() >= PLAY_DEAD_CHANCE) return false;
  a.playingDeadUntilMs = q.nowMs + PLAY_DEAD_DURATION_MS;
  a.lastPlayDeadMs = q.nowMs;
  return true;
}

export function isPlayingDead(a: AxolotlState, nowMs: number): boolean {
  return nowMs < a.playingDeadUntilMs;
}
