import { describe, it, expect } from 'vitest';
import {
  buildPacket,
  estimatedBytes,
  SPAWN_PACKET_VERSION,
  validatePacket,
  type BuildQuery,
} from './player_spawn_packet';

const BASE: BuildQuery = {
  entityId: 42,
  spawnPos: { x: 0, y: 64, z: 0 },
  yawRad: 0,
  pitchRad: 0,
  dimension: 'overworld',
  gameSeed: '1234',
  timeOfDay: 0.5,
  gamerules: { keepInventory: 'false' },
  spawnChunks: [{ cx: 0, cz: 0 }],
  players: [{ uuid: 'u1', name: 'alice' }],
};

describe('player spawn packet', () => {
  it('build round-trips version', () => {
    const p = buildPacket(BASE);
    expect(p.version).toBe(SPAWN_PACKET_VERSION);
  });

  it('validates a clean packet', () => {
    expect(validatePacket(buildPacket(BASE)).valid).toBe(true);
  });

  it('rejects empty spawn chunks', () => {
    const p = buildPacket({ ...BASE, spawnChunks: [] });
    expect(validatePacket(p).valid).toBe(false);
  });

  it('rejects bad entity id', () => {
    const p = buildPacket({ ...BASE, entityId: 0 });
    expect(validatePacket(p).valid).toBe(false);
  });

  it('rejects NaN position', () => {
    const p = buildPacket({ ...BASE, spawnPos: { x: NaN, y: 64, z: 0 } });
    expect(validatePacket(p).valid).toBe(false);
  });

  it('byte size grows with content', () => {
    const small = estimatedBytes(buildPacket(BASE));
    const large = estimatedBytes(
      buildPacket({
        ...BASE,
        spawnChunks: Array.from({ length: 100 }, (_, i) => ({ cx: i, cz: 0 })),
      }),
    );
    expect(large).toBeGreaterThan(small);
  });
});
