// Elytra durability. While gliding, elytra takes 1 damage per second
// (20 ticks). Unbreaking I/II/III extend durability by 50/66/75% (MC
// formula: 1/(level+1) chance to skip damage per tick). Mending on
// elytra works from picked-up XP orbs while worn.

export interface ElytraDurabilityQuery {
  gliding: boolean;
  unbreakingLevel: number; // 0..3
  dtSec: number;
  secondsCarry: number;
  randomRoll: () => number;
  currentDurability: number;
}

export const ELYTRA_MAX_DURABILITY = 432;
const BREAK_RESERVE = 1; // MC: elytra becomes unusable at durability 1 (not 0)

export interface ElytraDurabilityResult {
  newDurability: number;
  brokenThisTick: boolean;
  secondsCarry: number;
}

export function tickElytraDurability(q: ElytraDurabilityQuery): ElytraDurabilityResult {
  if (!q.gliding || q.currentDurability <= BREAK_RESERVE) {
    return {
      newDurability: q.currentDurability,
      brokenThisTick: false,
      secondsCarry: q.secondsCarry,
    };
  }
  const seconds = q.secondsCarry + q.dtSec;
  const damageTicks = Math.floor(seconds);
  const carry = seconds - damageTicks;
  let dur = q.currentDurability;
  let broken = false;
  for (let i = 0; i < damageTicks; i++) {
    // Unbreaking: chance to skip damage.
    if (q.unbreakingLevel > 0 && q.randomRoll() < q.unbreakingLevel / (q.unbreakingLevel + 1)) {
      continue;
    }
    dur = Math.max(BREAK_RESERVE, dur - 1);
    if (dur <= BREAK_RESERVE) {
      broken = true;
      break;
    }
  }
  return { newDurability: dur, brokenThisTick: broken, secondsCarry: carry };
}

// Repairing elytra: only phantom membrane in an anvil (restores 108
// durability per membrane, up to 4 membranes = full).
export const MEMBRANE_REPAIR_AMOUNT = 108;

export function repairWithMembrane(currentDurability: number): number {
  return Math.min(ELYTRA_MAX_DURABILITY, currentDurability + MEMBRANE_REPAIR_AMOUNT);
}

// Unusable at durability ≤ 1: prevents glide activation.
export function canDeploy(durability: number): boolean {
  return durability > BREAK_RESERVE;
}
