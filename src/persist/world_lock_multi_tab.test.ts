import { describe, it, expect } from 'vitest';
import { acquire, refresh, HEARTBEAT_TIMEOUT_MS } from './world_lock_multi_tab';

describe('world lock multi tab', () => {
  it('no record → acquired', () => {
    expect(acquire(undefined, 'tabA', 0)?.tabId).toBe('tabA');
  });

  it('same tab refreshes', () => {
    const l = acquire(undefined, 'tabA', 0);
    const r = acquire(l, 'tabA', 500);
    expect(r?.heartbeatMs).toBe(500);
  });

  it('another tab blocked', () => {
    const l = { worldId: 'w', tabId: 'tabA', heartbeatMs: 100 };
    expect(acquire(l, 'tabB', 200)).toBeUndefined();
  });

  it('stale lock taken over', () => {
    const l = { worldId: 'w', tabId: 'tabA', heartbeatMs: 0 };
    expect(acquire(l, 'tabB', HEARTBEAT_TIMEOUT_MS)?.tabId).toBe('tabB');
  });

  it('refresh updates heartbeat', () => {
    const l = { worldId: 'w', tabId: 'tabA', heartbeatMs: 0 };
    expect(refresh(l, 9999).heartbeatMs).toBe(9999);
  });
});
