import { describe, it, expect, afterEach } from 'vitest';
import { spawn, type ChildProcess } from 'node:child_process';
import { WebSocket } from 'ws';
import { resolve } from 'node:path';

// Exercise the signaling server by spawning it as a subprocess, then
// opening two WebSocket clients that create/join/signal.

let child: ChildProcess | null = null;
const PORT = 7788;
const SCRIPT = resolve(process.cwd(), 'signaling', 'server.ts');

async function startServer(): Promise<void> {
  child = spawn('node', ['--experimental-strip-types', SCRIPT], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise<void>((resolvePromise, rejectPromise) => {
    const timer = setTimeout(() => {
      rejectPromise(new Error('signaling server did not start in time'));
    }, 8000);
    child?.stdout?.on('data', (buf: Buffer) => {
      if (buf.toString().includes('listening on')) {
        clearTimeout(timer);
        resolvePromise();
      }
    });
    child?.on('error', rejectPromise);
  });
}

afterEach(async () => {
  if (child && !child.killed) {
    child.kill();
    await new Promise<void>((r) => {
      child?.once('exit', () => {
        r();
      });
    });
  }
  child = null;
});

function openClient(): Promise<WebSocket> {
  return new Promise((r, reject) => {
    const ws = new WebSocket(`ws://127.0.0.1:${String(PORT)}`);
    ws.on('open', () => {
      r(ws);
    });
    ws.on('error', reject);
  });
}

function waitForMessage(
  ws: WebSocket,
  predicate: (obj: Record<string, unknown>) => boolean,
): Promise<Record<string, unknown>> {
  return new Promise((r, reject) => {
    const timer = setTimeout(() => {
      ws.off('message', handler);
      reject(new Error('timeout waiting for message'));
    }, 5000);
    const handler = (raw: Buffer): void => {
      try {
        const obj = JSON.parse(raw.toString('utf8')) as Record<string, unknown>;
        if (predicate(obj)) {
          clearTimeout(timer);
          ws.off('message', handler);
          r(obj);
        }
      } catch {
        /* ignore */
      }
    };
    ws.on('message', handler);
  });
}

describe('signaling server', () => {
  it('create / join / signal relay', async () => {
    await startServer();

    const host = await openClient();
    host.send(JSON.stringify({ type: 'create', name: 'Alice' }));
    const roomMsg = await waitForMessage(host, (m) => m['type'] === 'room');
    const code = roomMsg['code'] as string;
    const hostPeerId = roomMsg['peerId'] as string;
    expect(code).toMatch(/^[A-Z0-9]{6}$/);

    const guest = await openClient();
    guest.send(JSON.stringify({ type: 'join', code }));
    const joinedMsg = await waitForMessage(guest, (m) => m['type'] === 'joined');
    const guestPeerId = joinedMsg['peerId'] as string;
    expect(joinedMsg['hostPeerId']).toBe(hostPeerId);

    // Host should receive peer-joined
    const peerJoined = await waitForMessage(host, (m) => m['type'] === 'peer-joined');
    expect(peerJoined['peerId']).toBe(guestPeerId);

    // Guest sends a signal to host
    guest.send(JSON.stringify({ type: 'signal', to: hostPeerId, payload: { sdp: 'fake-offer' } }));
    const relayed = await waitForMessage(host, (m) => m['type'] === 'signal');
    expect(relayed['from']).toBe(guestPeerId);
    const payload = relayed['payload'] as Record<string, unknown>;
    expect(payload['sdp']).toBe('fake-offer');

    // Guest disconnects → host receives peer-left
    guest.close();
    const peerLeft = await waitForMessage(host, (m) => m['type'] === 'peer-left');
    expect(peerLeft['peerId']).toBe(guestPeerId);

    host.close();
  }, 30_000);

  it('rejects join for unknown room', async () => {
    await startServer();
    const ws = await openClient();
    ws.send(JSON.stringify({ type: 'join', code: 'ZZZZZZ' }));
    const err = await waitForMessage(ws, (m) => m['type'] === 'error');
    expect(err['message']).toMatch(/not found/);
    ws.close();
  }, 15_000);
});
