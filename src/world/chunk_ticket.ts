// Chunk ticket system. A ticket keeps a chunk (and its neighbours within
// the ticket's level radius) loaded + ticking. Players emit a "player"
// ticket of level 32; forceload emits "forced" level 31; spawn emits
// "spawn" level 29.

export type TicketKind = 'player' | 'forced' | 'spawn' | 'portal' | 'command';

export interface ChunkTicket {
  kind: TicketKind;
  level: number;
  ownerId: string; // player id / command id / etc.
  expiresInTicks: number; // -1 = permanent
}

export interface ChunkPos {
  cx: number;
  cz: number;
}

const TICKET_LEVEL: Record<TicketKind, number> = {
  player: 32,
  forced: 31,
  spawn: 29,
  portal: 30,
  command: 30,
};

export class ChunkTicketTracker {
  private readonly tickets = new Map<string, ChunkTicket[]>();

  private key(c: ChunkPos): string {
    return `${c.cx.toString()},${c.cz.toString()}`;
  }

  add(chunk: ChunkPos, kind: TicketKind, ownerId: string, expiresInTicks = -1): void {
    const k = this.key(chunk);
    const list = this.tickets.get(k) ?? [];
    list.push({ kind, level: TICKET_LEVEL[kind], ownerId, expiresInTicks });
    this.tickets.set(k, list);
  }

  remove(chunk: ChunkPos, kind: TicketKind, ownerId: string): boolean {
    const k = this.key(chunk);
    const list = this.tickets.get(k);
    if (!list) return false;
    const filtered = list.filter((t) => t.kind !== kind || t.ownerId !== ownerId);
    if (filtered.length === 0) this.tickets.delete(k);
    else this.tickets.set(k, filtered);
    return filtered.length !== list.length;
  }

  hasTicket(chunk: ChunkPos): boolean {
    return this.tickets.has(this.key(chunk));
  }

  ticketLevel(chunk: ChunkPos): number {
    const list = this.tickets.get(this.key(chunk));
    if (!list || list.length === 0) return 44; // unloaded level
    let best = 44;
    for (const t of list) if (t.level < best) best = t.level;
    return best;
  }

  decayTickets(): readonly { chunk: ChunkPos; kind: TicketKind; ownerId: string }[] {
    const expired: { chunk: ChunkPos; kind: TicketKind; ownerId: string }[] = [];
    for (const [k, list] of this.tickets) {
      const next: ChunkTicket[] = [];
      for (const t of list) {
        if (t.expiresInTicks < 0) {
          next.push(t);
          continue;
        }
        if (t.expiresInTicks <= 1) {
          const [cx, cz] = k.split(',').map(Number);
          expired.push({
            chunk: { cx: cx ?? 0, cz: cz ?? 0 },
            kind: t.kind,
            ownerId: t.ownerId,
          });
          continue;
        }
        next.push({ ...t, expiresInTicks: t.expiresInTicks - 1 });
      }
      if (next.length === 0) this.tickets.delete(k);
      else this.tickets.set(k, next);
    }
    return expired;
  }
}
