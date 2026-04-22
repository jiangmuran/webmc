// Axolotl. Playing dead when hurt → damage resistance + regeneration for
// 10s, can't be re-played-dead for 5min. 5 color variants (lucky blue is
// extra rare).

export type AxolotlColor = 'lucy' | 'wild' | 'gold' | 'cyan' | 'blue';

export interface AxolotlState {
  color: AxolotlColor;
  playingDead: boolean;
  playDeadRemainingSec: number;
  playDeadCooldownSec: number;
  hp: number;
}

const PLAY_DEAD_DURATION = 10;
const PLAY_DEAD_COOLDOWN = 5 * 60;

export function makeAxolotl(color: AxolotlColor = 'wild'): AxolotlState {
  return {
    color,
    playingDead: false,
    playDeadRemainingSec: 0,
    playDeadCooldownSec: 0,
    hp: 14,
  };
}

export function onAxolotlHurt(state: AxolotlState): boolean {
  if (state.playingDead || state.playDeadCooldownSec > 0) return false;
  state.playingDead = true;
  state.playDeadRemainingSec = PLAY_DEAD_DURATION;
  state.playDeadCooldownSec = PLAY_DEAD_COOLDOWN;
  return true;
}

export function tickAxolotl(state: AxolotlState, dtSec: number): void {
  state.playDeadRemainingSec = Math.max(0, state.playDeadRemainingSec - dtSec);
  state.playDeadCooldownSec = Math.max(0, state.playDeadCooldownSec - dtSec);
  if (state.playingDead && state.playDeadRemainingSec === 0) state.playingDead = false;
  if (state.playingDead) state.hp = Math.min(14, state.hp + dtSec * 0.5);
}

// 1/1200 (very rare) chance to produce a blue axolotl baby.
export function rollBabyColor(
  a: AxolotlColor,
  b: AxolotlColor,
  rng: () => number = Math.random,
): AxolotlColor {
  if (rng() < 1 / 1200) return 'blue';
  return rng() < 0.5 ? a : b;
}
