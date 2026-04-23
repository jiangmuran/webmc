import { describe, it, expect } from 'vitest';
import { pickNewHost, canHostMigrate, MIGRATION_STATE_TRANSFER_ORDER } from './host_migration';

describe('host migration', () => {
  it('picks lowest latency eligible', () => {
    expect(
      pickNewHost({
        formerHostId: 'h',
        remainingPeers: [
          { id: 'a', latencyToHostMs: 200, canHost: true },
          { id: 'b', latencyToHostMs: 50, canHost: true },
          { id: 'c', latencyToHostMs: 10, canHost: false },
        ],
      }),
    ).toBe('b');
  });

  it('tie-break by id', () => {
    expect(
      pickNewHost({
        formerHostId: 'h',
        remainingPeers: [
          { id: 'b', latencyToHostMs: 10, canHost: true },
          { id: 'a', latencyToHostMs: 10, canHost: true },
        ],
      }),
    ).toBe('a');
  });

  it('no eligible null', () => {
    expect(
      pickNewHost({
        formerHostId: 'h',
        remainingPeers: [{ id: 'x', latencyToHostMs: 10, canHost: false }],
      }),
    ).toBeNull();
  });

  it('feature gated', () => {
    expect(canHostMigrate(false)).toBe(false);
    expect(canHostMigrate(true)).toBe(true);
  });

  it('transfer order includes world + entities', () => {
    expect(MIGRATION_STATE_TRANSFER_ORDER).toContain('world_meta');
    expect(MIGRATION_STATE_TRANSFER_ORDER).toContain('entities');
  });
});
