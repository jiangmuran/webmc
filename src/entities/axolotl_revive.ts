// Axolotl "play dead" + combat buffs. Axolotl in water has 33% chance
// to play dead when damaged, restoring health to full over 10s.
// Attacking a mob attacked by an axolotl gives the player
// "Regeneration I" for 100 SECONDS + clears Mining Fatigue.
//
// Wiki (minecraft.wiki/w/Axolotl#Behavior): "An axolotl in water that
// takes damage has a 1/3 chance to play dead." Old PLAY_DEAD_CHANCE
// was 0.5 — Bedrock-style overestimate, ~50% more frequent than the
// Java 33% Vanilla value. Sibling axolotl_play_dead.ts already uses
// 0.333.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface AxolotlState {
  id: number;
  position: Vec3;
  health: number;
  maxHealth: number;
  inWater: boolean;
  playingDead: boolean;
  playDeadSecondsLeft: number;
}

export const AXOLOTL_MAX_HEALTH = 14;
const PLAY_DEAD_DURATION_SEC = 10;
const PLAY_DEAD_CHANCE = 1 / 3;

export function makeAxolotl(id: number, at: Vec3): AxolotlState {
  return {
    id,
    position: { ...at },
    health: AXOLOTL_MAX_HEALTH,
    maxHealth: AXOLOTL_MAX_HEALTH,
    inWater: true,
    playingDead: false,
    playDeadSecondsLeft: 0,
  };
}

export interface DamageResult {
  startedPlayingDead: boolean;
  damageReceived: number;
}

export function damageAxolotl(state: AxolotlState, amount: number, roll: number): DamageResult {
  if (!state.playingDead && state.inWater && roll < PLAY_DEAD_CHANCE) {
    state.playingDead = true;
    state.playDeadSecondsLeft = PLAY_DEAD_DURATION_SEC;
    return { startedPlayingDead: true, damageReceived: 0 };
  }
  if (state.playingDead) {
    // play-dead blocks damage
    return { startedPlayingDead: false, damageReceived: 0 };
  }
  state.health = Math.max(0, state.health - amount);
  return { startedPlayingDead: false, damageReceived: amount };
}

export function tickAxolotl(state: AxolotlState, dtSec: number): void {
  if (state.playingDead) {
    state.playDeadSecondsLeft -= dtSec;
    // Regen 1 HP / second while playing dead.
    state.health = Math.min(state.maxHealth, state.health + dtSec);
    if (state.playDeadSecondsLeft <= 0) {
      state.playingDead = false;
      state.playDeadSecondsLeft = 0;
    }
  }
}

// Buff granted to a player who killed a mob the axolotl was attacking.
export interface AxolotlBuff {
  applyRegeneration: boolean;
  regenDurationSec: number;
  clearMiningFatigue: boolean;
}

// Wiki (minecraft.wiki/w/Axolotl#Behavior): when an axolotl helps the
// player kill a hostile, the player gets Regeneration I for 100
// SECONDS (2000 ticks) and Mining Fatigue is cleared. Old code used
// 100/20 = 5 seconds (treating the 100 as ticks instead of seconds).
export function killAssistBuff(): AxolotlBuff {
  return {
    applyRegeneration: true,
    regenDurationSec: 100,
    clearMiningFatigue: true,
  };
}

// Axolotls follow players holding a bucket of tropical fish.
export function attractedBy(heldItem: string): boolean {
  return heldItem === 'webmc:tropical_fish_bucket';
}
