import { describe, it, expect } from 'vitest';
import { AIR, makeState, stateId } from '@/blocks/state';
import { World } from '@/world/World';
import { MPSession } from './MPSession';
import type { Transport, TransportChannel } from './transport';

class MockTransport implements Transport {
  readonly sent: { channel: TransportChannel; bytes: Uint8Array }[] = [];
  private listeners: ((channel: TransportChannel, bytes: Uint8Array) => void)[] = [];
  private closers: ((reason?: string) => void)[] = [];

  constructor(readonly peerId: string) {}

  send(channel: TransportChannel, bytes: Uint8Array): void {
    this.sent.push({ channel, bytes: new Uint8Array(bytes) });
  }

  deliver(channel: TransportChannel, bytes: Uint8Array): void {
    for (const l of this.listeners) l(channel, bytes);
  }

  onMessage(cb: (channel: TransportChannel, bytes: Uint8Array) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  onClose(cb: (reason?: string) => void): () => void {
    this.closers.push(cb);
    return () => {
      this.closers = this.closers.filter((c) => c !== cb);
    };
  }

  close(reason?: string): void {
    for (const c of this.closers) c(reason);
  }
}

const STONE_ID = 1;
const STONE = makeState(STONE_ID, 0);

describe('MPSession', () => {
  it('host broadcasts local edits to all peers and applies locally', () => {
    const world = new World();
    const hostSession = new MPSession({ world, localPeerId: 'host', role: 'host' });
    const peerA = new MockTransport('a');
    const peerB = new MockTransport('b');
    hostSession.addPeer('a', peerA);
    hostSession.addPeer('b', peerB);

    hostSession.applyLocalBlockEdit({ x: 5, y: 40, z: 5, block: STONE_ID, meta: 0 });

    expect(world.get(5, 40, 5)).toBe(STONE);
    expect(peerA.sent).toHaveLength(1);
    expect(peerB.sent).toHaveLength(1);
  });

  it('guest sends local edits to the host only', () => {
    const world = new World();
    const guestSession = new MPSession({ world, localPeerId: 'guest', role: 'guest' });
    const hostT = new MockTransport('host');
    guestSession.addPeer('host', hostT);

    guestSession.applyLocalBlockEdit({ x: 1, y: 30, z: 1, block: STONE_ID, meta: 0 });

    expect(world.get(1, 30, 1)).toBe(STONE);
    expect(hostT.sent).toHaveLength(1);
  });

  it('host rebroadcasts guest edits to other peers (but not back to sender)', () => {
    const world = new World();
    const hostSession = new MPSession({ world, localPeerId: 'host', role: 'host' });
    const peerA = new MockTransport('a');
    const peerB = new MockTransport('b');
    hostSession.addPeer('a', peerA);
    hostSession.addPeer('b', peerB);

    // Peer A encodes and delivers a BLOCK_EDIT to host via its transport.
    const bytes = (() => {
      const tmpSession = new MPSession({ world: new World(), localPeerId: 'a', role: 'guest' });
      const hostMock = new MockTransport('host');
      tmpSession.addPeer('host', hostMock);
      tmpSession.applyLocalBlockEdit({ x: 2, y: 35, z: 2, block: STONE_ID, meta: 0 });
      return hostMock.sent[0]?.bytes ?? new Uint8Array();
    })();

    peerA.deliver('reliable', bytes);
    expect(world.get(2, 35, 2)).toBe(STONE);
    // A should NOT receive its own edit back; B should.
    expect(peerA.sent).toHaveLength(0);
    expect(peerB.sent).toHaveLength(1);
  });

  it('guest applies edits delivered from the host', () => {
    const hostWorld = new World();
    const guestWorld = new World();
    const host = new MPSession({ world: hostWorld, localPeerId: 'host', role: 'host' });
    const guestT = new MockTransport('guest');
    host.addPeer('guest', guestT);
    host.applyLocalBlockEdit({ x: 9, y: 42, z: 9, block: STONE_ID, meta: 0 });

    const guest = new MPSession({ world: guestWorld, localPeerId: 'guest', role: 'guest' });
    const hostT = new MockTransport('host');
    guest.addPeer('host', hostT);
    hostT.deliver('reliable', guestT.sent[0]?.bytes ?? new Uint8Array());

    expect(guestWorld.get(9, 42, 9)).toBe(STONE);
  });

  it('chat messages reach the onChat callback', () => {
    const world = new World();
    const received: { from: string; text: string }[] = [];
    const session = new MPSession({
      world,
      localPeerId: 'me',
      role: 'host',
      onChat: (from, text) => received.push({ from, text }),
    });
    const peer = new MockTransport('a');
    session.addPeer('a', peer);

    const tmp = new MPSession({ world: new World(), localPeerId: 'a', role: 'guest' });
    const toHost = new MockTransport('host');
    tmp.addPeer('host', toHost);
    tmp.sendChat('hello');
    peer.deliver('reliable', toHost.sent[0]?.bytes ?? new Uint8Array());

    expect(received).toEqual([{ from: 'a', text: 'hello' }]);
  });

  it('removePeer unsubscribes and subsequent messages are ignored', () => {
    const world = new World();
    const session = new MPSession({ world, localPeerId: 'host', role: 'host' });
    const peer = new MockTransport('a');
    session.addPeer('a', peer);
    session.removePeer('a');
    const tmp = new MPSession({ world: new World(), localPeerId: 'a', role: 'guest' });
    const toHost = new MockTransport('host');
    tmp.addPeer('host', toHost);
    tmp.applyLocalBlockEdit({ x: 1, y: 1, z: 1, block: STONE_ID, meta: 0 });
    peer.deliver('reliable', toHost.sent[0]?.bytes ?? new Uint8Array());
    expect(stateId(world.get(1, 1, 1))).toBe(0);
    void AIR;
  });
});
