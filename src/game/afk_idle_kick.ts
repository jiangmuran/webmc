export interface IdleCtx {
  lastInputTick: number;
  currentTick: number;
  idleKickEnabled: boolean;
}

export const IDLE_KICK_TICKS = 36000;
export const AFK_FLAG_TICKS = 6000;

export function isAfk(c: IdleCtx): boolean {
  return c.currentTick - c.lastInputTick >= AFK_FLAG_TICKS;
}

export function shouldKick(c: IdleCtx): boolean {
  return c.idleKickEnabled && c.currentTick - c.lastInputTick >= IDLE_KICK_TICKS;
}
