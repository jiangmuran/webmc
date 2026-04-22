// Armadillo (1.20.5). A passive mob that curls into a ball when scared.
// Drops armadillo scutes periodically; scutes are crafted into Wolf Armor.

export interface ArmadilloState {
  rolled: boolean;
  scuteCooldownSec: number;
}

const SCUTE_COOLDOWN_SEC = 300; // 5 min between scutes
const SCARE_DISTANCE_SQ = 3 * 3;

export function makeArmadilloState(): ArmadilloState {
  return { rolled: false, scuteCooldownSec: 0 };
}

export interface ArmadilloTickContext {
  nearbyScarySources: readonly { distanceSq: number }[];
  dtSec: number;
}

export interface ArmadilloStepResult {
  droppedScute: boolean;
}

export function tickArmadillo(
  state: ArmadilloState,
  ctx: ArmadilloTickContext,
): ArmadilloStepResult {
  const rolled = ctx.nearbyScarySources.some((s) => s.distanceSq <= SCARE_DISTANCE_SQ);
  state.rolled = rolled;
  state.scuteCooldownSec = Math.max(0, state.scuteCooldownSec - ctx.dtSec);
  if (!rolled && state.scuteCooldownSec === 0) {
    state.scuteCooldownSec = SCUTE_COOLDOWN_SEC;
    return { droppedScute: true };
  }
  return { droppedScute: false };
}

// Wolf armor — pass Armadillo Scute + wolf with diamond-level defense.
export interface WolfArmorState {
  equipped: boolean;
  color: string; // dye color
  durability: number;
  maxDurability: number;
}

export function makeWolfArmor(): WolfArmorState {
  return { equipped: false, color: '#ffffff', durability: 64, maxDurability: 64 };
}

export function equipWolfArmor(state: WolfArmorState): void {
  state.equipped = true;
  state.durability = state.maxDurability;
}

export function damageWolfArmor(state: WolfArmorState, amount: number): boolean {
  if (!state.equipped) return false;
  state.durability = Math.max(0, state.durability - amount);
  if (state.durability === 0) state.equipped = false;
  return true;
}

export function dyeWolfArmor(state: WolfArmorState, color: string): void {
  state.color = color;
}
