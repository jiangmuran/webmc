// Hoglin vs Piglin mutual hostility. Also: hoglin avoids warped_fungus;
// piglin charges any gold-dropped item within 16 blocks.

export interface Hoglin {
  inOverworld: boolean;
  ticksSinceLastAvoid: number;
}

export interface Piglin {
  aggroedOnZombifiedHoglin: boolean;
}

export function hoglinAvoidsWarpedFungus(): boolean {
  return true;
}

// Wiki: hoglins in the Overworld zombify into zoglins after 300
// SECONDS (6000 ticks), not 300 ticks. Old value was 20× too short.
export const HOGLIN_ZOMBIFY_TICKS = 6000;

export interface OverworldTickResult {
  zombified: boolean;
}

export function tickOverworldHoglin(h: Hoglin & { ticksInOverworld: number }): OverworldTickResult {
  if (!h.inOverworld) return { zombified: false };
  h.ticksInOverworld += 1;
  return { zombified: h.ticksInOverworld >= HOGLIN_ZOMBIFY_TICKS };
}

// Piglin notices dropped gold within radius.
export const PIGLIN_GOLD_PICKUP_RADIUS = 16;

export function piglinNoticesGold(distance: number): boolean {
  return distance <= PIGLIN_GOLD_PICKUP_RADIUS;
}

// Hoglin attacks piglin on sight, and vice-versa in Nether.
export function hoglinPiglinEngage(inNether: boolean): boolean {
  return inNether;
}
