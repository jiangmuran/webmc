import { describe, it, expect } from 'vitest';
import {
  lowestLevel,
  isTicking,
  isLoaded,
  pruneExpired,
  INACCESSIBLE,
  TICK_THRESHOLD,
  type ChunkTicket,
} from './chunk_ticket_system';

describe('chunk ticket system', () => {
  it('no tickets inaccessible', () => {
    expect(lowestLevel([])).toBe(INACCESSIBLE);
  });

  it('player ticket lowers level', () => {
    const t: ChunkTicket[] = [{ type: 'player', level: 10 }];
    expect(lowestLevel(t)).toBe(10);
  });

  it('many tickets take min', () => {
    const t: ChunkTicket[] = [
      { type: 'player', level: 30 },
      { type: 'forced', level: 5 },
    ];
    expect(lowestLevel(t)).toBe(5);
  });

  it('ticking below threshold', () => {
    expect(isTicking(TICK_THRESHOLD)).toBe(true);
    expect(isTicking(TICK_THRESHOLD + 1)).toBe(false);
  });

  it('loaded below border', () => {
    expect(isLoaded(30)).toBe(true);
    expect(isLoaded(50)).toBe(false);
  });

  it('prunes expired', () => {
    const t: ChunkTicket[] = [
      { type: 'portal', level: 20, expiresAtTick: 100 },
      { type: 'player', level: 10 },
    ];
    expect(pruneExpired(t, 200)).toHaveLength(1);
  });
});
