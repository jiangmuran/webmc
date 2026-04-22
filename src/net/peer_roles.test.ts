import { describe, it, expect } from 'vitest';
import { RoomState } from './peer_roles';

describe('peer roles', () => {
  it('first joiner is host', () => {
    const r = new RoomState();
    const role = r.join({ peerId: 'p1', uuid: 'u1', name: 'alice', joinedAtSec: 0 });
    expect(role).toBe('host');
  });

  it('subsequent joiners are clients', () => {
    const r = new RoomState();
    r.join({ peerId: 'p1', uuid: 'u1', name: 'alice', joinedAtSec: 0 });
    expect(r.join({ peerId: 'p2', uuid: 'u2', name: 'bob', joinedAtSec: 1 })).toBe('client');
  });

  it('host leave triggers host_left', () => {
    const r = new RoomState();
    r.join({ peerId: 'p1', uuid: 'u1', name: 'alice', joinedAtSec: 0 });
    expect(r.leave('p1')).toBe('host_left');
  });

  it('client leave is normal', () => {
    const r = new RoomState();
    r.join({ peerId: 'p1', uuid: 'u1', name: 'alice', joinedAtSec: 0 });
    r.join({ peerId: 'p2', uuid: 'u2', name: 'bob', joinedAtSec: 1 });
    expect(r.leave('p2')).toBe('normal_leave');
  });

  it('promote co-host after host leaves', () => {
    const r = new RoomState();
    r.join({ peerId: 'p1', uuid: 'u1', name: 'alice', joinedAtSec: 0 });
    r.join({ peerId: 'p2', uuid: 'u2', name: 'bob', joinedAtSec: 1 }, true);
    r.leave('p1');
    const promoted = r.promoteCoHost();
    expect(promoted?.peerId).toBe('p2');
    expect(promoted?.role).toBe('host');
  });

  it('no co-host → no promotion', () => {
    const r = new RoomState();
    r.join({ peerId: 'p1', uuid: 'u1', name: 'alice', joinedAtSec: 0 });
    r.join({ peerId: 'p2', uuid: 'u2', name: 'bob', joinedAtSec: 1 });
    r.leave('p1');
    expect(r.promoteCoHost()).toBeNull();
  });

  it('clients list excludes host', () => {
    const r = new RoomState();
    r.join({ peerId: 'p1', uuid: 'u1', name: 'alice', joinedAtSec: 0 });
    r.join({ peerId: 'p2', uuid: 'u2', name: 'bob', joinedAtSec: 1 });
    expect(r.clients().length).toBe(1);
  });
});
