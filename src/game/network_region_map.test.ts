import { describe, it, expect } from 'vitest';
import { recipientIds, chatRecipients, type RoomPlayer } from './network_region_map';

const players: RoomPlayer[] = [
  { id: 'a', dim: 'overworld', cx: 0, cz: 0 },
  { id: 'b', dim: 'overworld', cx: 3, cz: 0 },
  { id: 'c', dim: 'nether', cx: 0, cz: 0 },
  { id: 'd', dim: 'overworld', cx: 100, cz: 100 },
];

describe('network region', () => {
  it('broadcast by radius + dim', () => {
    const r = recipientIds({
      players,
      fromDim: 'overworld',
      fromCx: 0,
      fromCz: 0,
      radiusChunks: 5,
    });
    expect(r.sort()).toEqual(['a', 'b']);
  });

  it('nether isolated', () => {
    const r = recipientIds({
      players,
      fromDim: 'nether',
      fromCx: 0,
      fromCz: 0,
      radiusChunks: 100,
    });
    expect(r).toEqual(['c']);
  });

  it('chat excludes sender', () => {
    const sender = players[0];
    if (!sender) throw new Error('empty');
    const r = chatRecipients(players, sender);
    expect(r).not.toContain('a');
    expect(r.length).toBe(players.length - 1);
  });
});
