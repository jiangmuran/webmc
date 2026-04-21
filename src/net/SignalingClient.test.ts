import { describe, it, expect } from 'vitest';
import { type SignalingSocket, createSignalingClient } from './SignalingClient';

class FakeSocket {
  readyState = 0;
  sent: string[] = [];
  private listeners = new Map<string, ((arg: unknown) => void)[]>();

  send(data: string): void {
    this.sent.push(data);
  }

  close(_code?: number, reason = ''): void {
    this.readyState = 3;
    this.emit('close', { code: 1000, reason });
  }

  addEventListener(type: string, listener: (arg: unknown) => void): void {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type)?.push(listener);
  }

  emit(type: string, arg: unknown): void {
    for (const l of this.listeners.get(type) ?? []) l(arg);
  }

  open(): void {
    this.readyState = 1;
    this.emit('open', undefined);
  }

  recv(obj: Record<string, unknown>): void {
    this.emit('message', { data: JSON.stringify(obj) });
  }
}

function asSocket(s: FakeSocket): SignalingSocket {
  return s as unknown as SignalingSocket;
}

describe('SignalingClient', () => {
  it('connect resolves on open', async () => {
    const sock = new FakeSocket();
    const client = createSignalingClient('ws://x', () => asSocket(sock));
    const p = client.connect();
    sock.open();
    await p;
    expect(client.connected).toBe(true);
  });

  it('create sends the create envelope', async () => {
    const sock = new FakeSocket();
    const client = createSignalingClient('ws://x', () => asSocket(sock));
    const p = client.connect();
    sock.open();
    await p;
    client.create('Alice');
    expect(sock.sent).toHaveLength(1);
    expect(JSON.parse(sock.sent[0] ?? '')).toEqual({ type: 'create', name: 'Alice' });
  });

  it('dispatches room / joined / peer-joined / peer-left / signal / error', async () => {
    const sock = new FakeSocket();
    const client = createSignalingClient('ws://x', () => asSocket(sock));
    const p = client.connect();
    sock.open();
    await p;

    let roomCode = '';
    let joinedPeers: string[] = [];
    let peerJoinedId = '';
    let peerLeftId = '';
    let signalFrom = '';
    let signalPayload: unknown = null;
    let errorMessage = '';

    client.onRoom((code) => {
      roomCode = code;
    });
    client.onJoined((info) => {
      joinedPeers = info.peers;
    });
    client.onPeerJoined((id) => {
      peerJoinedId = id;
    });
    client.onPeerLeft((id) => {
      peerLeftId = id;
    });
    client.onSignal((msg) => {
      signalFrom = msg.from;
      signalPayload = msg.payload;
    });
    client.onError((m) => {
      errorMessage = m;
    });

    sock.recv({ type: 'room', code: 'ABC123', peerId: 'me' });
    expect(roomCode).toBe('ABC123');

    sock.recv({
      type: 'joined',
      code: 'ABC123',
      peerId: 'me',
      hostPeerId: 'host',
      peers: ['a', 'b'],
    });
    expect(joinedPeers).toEqual(['a', 'b']);

    sock.recv({ type: 'peer-joined', peerId: 'newbie' });
    expect(peerJoinedId).toBe('newbie');

    sock.recv({ type: 'peer-left', peerId: 'gone' });
    expect(peerLeftId).toBe('gone');

    sock.recv({ type: 'signal', from: 'other', payload: { sdp: 'offer' } });
    expect(signalFrom).toBe('other');
    expect(signalPayload).toEqual({ sdp: 'offer' });

    sock.recv({ type: 'error', message: 'room full' });
    expect(errorMessage).toBe('room full');
  });

  it('unsubscribe removes handlers', async () => {
    const sock = new FakeSocket();
    const client = createSignalingClient('ws://x', () => asSocket(sock));
    const p = client.connect();
    sock.open();
    await p;
    let count = 0;
    const off = client.onRoom(() => count++);
    sock.recv({ type: 'room', code: 'A', peerId: 'x' });
    off();
    sock.recv({ type: 'room', code: 'B', peerId: 'y' });
    expect(count).toBe(1);
  });
});
