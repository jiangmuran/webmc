// Chunk priority queue. Loaded chunks have a priority level determined
// by ticket type (player, forceload, portal, start, etc.). A chunk's
// effective priority is the min of all tickets on it. Once a ticket
// expires, the chunk may downgrade or unload.

export type TicketType = 'player' | 'forceload' | 'portal' | 'start' | 'spawn_chunk' | 'unknown';

export const TICKET_LEVELS: Record<TicketType, number> = {
  player: 31,
  forceload: 31,
  portal: 30,
  start: 22,
  spawn_chunk: 22,
  unknown: 33, // unloaded
};

export interface Ticket {
  type: TicketType;
  key: string; // chunk key "cx,cz"
  expiresAtSec: number | null; // null = permanent
  ownerId?: string;
}

export class ChunkTicketManager {
  private readonly byKey = new Map<string, Ticket[]>();

  addTicket(ticket: Ticket): void {
    let list = this.byKey.get(ticket.key);
    if (!list) {
      list = [];
      this.byKey.set(ticket.key, list);
    }
    list.push(ticket);
  }

  removeTicket(key: string, ownerId: string | undefined, type: TicketType): boolean {
    const list = this.byKey.get(key);
    if (!list) return false;
    const idx = list.findIndex((t) => t.type === type && t.ownerId === ownerId);
    if (idx < 0) return false;
    list.splice(idx, 1);
    if (list.length === 0) this.byKey.delete(key);
    return true;
  }

  tickets(key: string): readonly Ticket[] {
    return this.byKey.get(key) ?? [];
  }

  // Returns the effective level (lowest among tickets) or UNLOADED if none.
  levelOf(key: string): number {
    const list = this.byKey.get(key);
    if (!list || list.length === 0) return TICKET_LEVELS.unknown;
    let min = TICKET_LEVELS.unknown;
    for (const t of list) {
      const lvl = TICKET_LEVELS[t.type];
      if (lvl < min) min = lvl;
    }
    return min;
  }

  // Prune expired tickets; returns the number removed.
  prune(nowSec: number): number {
    let removed = 0;
    for (const [k, list] of this.byKey) {
      for (let i = list.length - 1; i >= 0; i--) {
        const t = list[i];
        if (!t) continue;
        if (t.expiresAtSec !== null && nowSec >= t.expiresAtSec) {
          list.splice(i, 1);
          removed++;
        }
      }
      if (list.length === 0) this.byKey.delete(k);
    }
    return removed;
  }

  loadedKeys(): string[] {
    return Array.from(this.byKey.keys());
  }
}

// Priority comparison for load queue: lower level = higher priority.
export function compareTicketLevels(a: number, b: number): number {
  return a - b;
}
