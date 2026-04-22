import { describe, it, expect } from 'vitest';
import { ChunkTicketTracker } from './chunk_ticket';

describe('chunk ticket', () => {
  it('add + has', () => {
    const t = new ChunkTicketTracker();
    t.add({ cx: 0, cz: 0 }, 'player', 'alice');
    expect(t.hasTicket({ cx: 0, cz: 0 })).toBe(true);
  });

  it('remove clears', () => {
    const t = new ChunkTicketTracker();
    t.add({ cx: 0, cz: 0 }, 'player', 'alice');
    t.remove({ cx: 0, cz: 0 }, 'player', 'alice');
    expect(t.hasTicket({ cx: 0, cz: 0 })).toBe(false);
  });

  it('level is min across tickets', () => {
    const t = new ChunkTicketTracker();
    t.add({ cx: 0, cz: 0 }, 'player', 'a');
    t.add({ cx: 0, cz: 0 }, 'spawn', 'b');
    expect(t.ticketLevel({ cx: 0, cz: 0 })).toBe(29);
  });

  it('decay removes timed tickets', () => {
    const t = new ChunkTicketTracker();
    t.add({ cx: 0, cz: 0 }, 'portal', 'x', 1);
    const expired = t.decayTickets();
    expect(expired.length).toBe(1);
    expect(t.hasTicket({ cx: 0, cz: 0 })).toBe(false);
  });

  it('permanent tickets never expire', () => {
    const t = new ChunkTicketTracker();
    t.add({ cx: 0, cz: 0 }, 'forced', 'x');
    t.decayTickets();
    expect(t.hasTicket({ cx: 0, cz: 0 })).toBe(true);
  });
});
