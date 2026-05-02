// Phantom spawn gate. Wiki (minecraft.wiki/w/Phantom#Java_Edition):
// "They spawn only if it is night or a thunderstorm is happening,
// the player is above sea level (y=64) with sky visible directly
// above … and the local difficulty is greater than a randomly
// chosen value between 0.0 and 3.0."
//
// JE (the AGENT_CHARTER target) has no light-level gate on phantom
// spawning — light ≤ 7 is a Bedrock-only rule (and even there it's
// the *spawn-block* light, not the player's). Old `lightLevel > 7`
// check caused JE phantoms to refuse to spawn over a torch-lit
// rooftop. `lightLevel` is retained on the ctx for caller
// compatibility but is intentionally unused.

export interface SpawnCtx {
  playerInsomniaTicks: number;
  skyVisible: boolean;
  timeOfDay: number;
  /** Bedrock-only; ignored on JE (the webmc target). */
  lightLevel: number;
}

export const INSOMNIA_THRESHOLD = 72000;

export function isNight(t: number): boolean {
  const w = ((t % 24000) + 24000) % 24000;
  return w >= 13000 && w < 23000;
}

export function canSpawn(c: SpawnCtx): boolean {
  if (!c.skyVisible) return false;
  if (!isNight(c.timeOfDay)) return false;
  return c.playerInsomniaTicks >= INSOMNIA_THRESHOLD;
}
