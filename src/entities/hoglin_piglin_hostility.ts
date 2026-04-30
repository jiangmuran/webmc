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

// Wiki (minecraft.wiki/w/Hoglin#Zombification): "Hoglins in the
// Overworld or End shake and convert into zoglins after 15 seconds
// (300 game ticks)." A previous fix mistakenly inflated this to
// 6000 ticks (5 minutes) — 20× too long. Sibling hoglin_zoglin.ts
// uses the correct 15 s.
export const HOGLIN_ZOMBIFY_TICKS = 300;

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
