export type TicketType = 'player' | 'forced' | 'portal' | 'dragon' | 'light' | 'unknown';

export interface ChunkTicket {
  type: TicketType;
  level: number;
  expiresAtTick?: number;
}

export const FULL_LOAD = 0;
export const TICK_THRESHOLD = 31;
export const BORDER = 33;
export const INACCESSIBLE = 44;

export function lowestLevel(tickets: readonly ChunkTicket[]): number {
  if (tickets.length === 0) return INACCESSIBLE;
  return tickets.reduce((min, t) => Math.min(min, t.level), INACCESSIBLE);
}

export function isTicking(level: number): boolean {
  return level <= TICK_THRESHOLD;
}

export function isLoaded(level: number): boolean {
  return level <= BORDER;
}

export function pruneExpired(
  tickets: readonly ChunkTicket[],
  currentTick: number,
): readonly ChunkTicket[] {
  return tickets.filter((t) => t.expiresAtTick === undefined || t.expiresAtTick > currentTick);
}
