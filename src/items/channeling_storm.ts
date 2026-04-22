// Channeling (trident). When a thunderstorm is active and the trident
// strikes a mob under open sky, it summons lightning on that mob.

export interface ChannelCtx {
  hasChanneling: boolean;
  thunderstorm: boolean;
  targetUnderOpenSky: boolean;
}

export function summonsLightning(c: ChannelCtx): boolean {
  return c.hasChanneling && c.thunderstorm && c.targetUnderOpenSky;
}

export function incompatibleWith(): string[] {
  return ['riptide'];
}

// Requires the trident to actually hit the entity (not arc-thrown hit air).
export function requiresHit(): boolean {
  return true;
}
