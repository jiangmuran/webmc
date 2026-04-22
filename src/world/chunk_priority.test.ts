import { describe, it, expect } from 'vitest';
import {
  ChunkTicketManager,
  compareTicketLevels,
  TICKET_LEVELS,
  type Ticket,
} from './chunk_priority';

function mk(
  type: Ticket['type'],
  key: string,
  ownerId?: string,
  expiresAtSec: number | null = null,
): Ticket {
  const base: Ticket = { type, key, expiresAtSec };
  if (ownerId !== undefined) base.ownerId = ownerId;
  return base;
}

describe('chunk priority', () => {
  it('unloaded key returns unknown level', () => {
    const m = new ChunkTicketManager();
    expect(m.levelOf('0,0')).toBe(TICKET_LEVELS.unknown);
  });

  it('player ticket sets level 31', () => {
    const m = new ChunkTicketManager();
    m.addTicket(mk('player', '0,0', 'p1'));
    expect(m.levelOf('0,0')).toBe(31);
  });

  it('min level wins', () => {
    const m = new ChunkTicketManager();
    m.addTicket(mk('player', '0,0', 'p1'));
    m.addTicket(mk('start', '0,0'));
    expect(m.levelOf('0,0')).toBe(22);
  });

  it('remove ticket', () => {
    const m = new ChunkTicketManager();
    m.addTicket(mk('player', '0,0', 'p1'));
    m.removeTicket('0,0', 'p1', 'player');
    expect(m.levelOf('0,0')).toBe(TICKET_LEVELS.unknown);
  });

  it('prune removes expired', () => {
    const m = new ChunkTicketManager();
    m.addTicket(mk('portal', '0,0', undefined, 100));
    const n = m.prune(200);
    expect(n).toBe(1);
    expect(m.levelOf('0,0')).toBe(TICKET_LEVELS.unknown);
  });

  it('loadedKeys list', () => {
    const m = new ChunkTicketManager();
    m.addTicket(mk('player', '0,0'));
    m.addTicket(mk('player', '1,0'));
    expect(m.loadedKeys().length).toBe(2);
  });

  it('compareTicketLevels', () => {
    expect(compareTicketLevels(22, 31)).toBeLessThan(0);
  });
});
