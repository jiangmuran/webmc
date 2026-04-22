import { describe, it, expect } from 'vitest';
import {
  evaluateTeleport,
  makeChunkLoadState,
  markChunkLoaded,
  requiredChunksFor,
  type TeleportRequest,
} from './teleport_load';

const REQ: TeleportRequest = {
  playerId: 'p1',
  from: { x: 0, y: 64, z: 0 },
  to: { x: 100, y: 64, z: 100 },
  fromDim: 'overworld',
  toDim: 'nether',
  reason: 'nether_portal',
  requestedAtSec: 100,
};

describe('teleport load', () => {
  it('3x3 chunks required', () => {
    const keys = requiredChunksFor(REQ);
    expect(keys.length).toBe(9);
  });

  it('destination chunk is in the set', () => {
    const keys = requiredChunksFor(REQ);
    expect(keys).toContain('nether:6,6');
  });

  it('missing chunks = pending', () => {
    const state = makeChunkLoadState();
    const r = evaluateTeleport(REQ, state, 100);
    expect(r.status).toBe('pending_chunks');
    expect(r.missingChunks.length).toBe(9);
  });

  it('all loaded = ready', () => {
    const state = makeChunkLoadState();
    for (const k of requiredChunksFor(REQ)) markChunkLoaded(state, k);
    const r = evaluateTeleport(REQ, state, 100);
    expect(r.status).toBe('ready');
  });

  it('timeout after 8s', () => {
    const state = makeChunkLoadState();
    const r = evaluateTeleport(REQ, state, 110);
    expect(r.status).toBe('timed_out');
  });
});
