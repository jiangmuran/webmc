// Piglin brute. Stronger piglin variant (bastion guardian). Ignores
// gold armor / bartering; cannot be pacified by any player action.

export interface PiglinBruteState {
  hp: number;
  aggro: boolean;
}

export function makePiglinBrute(): PiglinBruteState {
  return { hp: 50, aggro: true };
}

export interface BruteAggroQuery {
  playerWearingGold: boolean;
  playerDroppedGold: boolean;
}

// Piglin brutes always aggro — unlike piglins, gold armor doesn't calm them.
export function bruteShouldAggro(_q: BruteAggroQuery): boolean {
  void _q;
  return true;
}

// Wiki (minecraft.wiki/w/Piglin_Brute#Zombification): "When in the
// Overworld or the End, piglin brutes transform into zombified
// piglins after 15 seconds." Old constant was 300 s — 20× the
// wiki value, so a brute that escaped the Nether stayed a brute
// for 5 minutes instead of 15 s.
export const BRUTE_ZOMBIFY_SEC = 15;

export interface ZombifyCtx {
  inNether: boolean;
  dtSec: number;
}

export interface BruteZombifyState {
  conversionTimerSec: number;
  converted: boolean;
}

export function makeBruteZombifyState(): BruteZombifyState {
  return { conversionTimerSec: 0, converted: false };
}

export function tickBruteZombify(state: BruteZombifyState, ctx: ZombifyCtx): boolean {
  if (state.converted) return false;
  if (ctx.inNether) {
    state.conversionTimerSec = 0;
    return false;
  }
  state.conversionTimerSec += ctx.dtSec;
  if (state.conversionTimerSec >= BRUTE_ZOMBIFY_SEC) {
    state.converted = true;
    return true;
  }
  return false;
}
