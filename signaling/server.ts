#!/usr/bin/env -S node --experimental-strip-types
/**
 * webmc signaling server.
 *
 * A minimal WebSocket relay for WebRTC negotiation between peers.
 * It exchanges SDP offers/answers and ICE candidates. Never sees
 * game traffic — that goes over the WebRTC DataChannels the peers
 * establish between themselves after signaling completes.
 *
 * Protocol (JSON, newline-free):
 *   Client → Server:
 *     { "type": "create", "name": "..." }
 *     { "type": "join",   "code": "ABC123" }
 *     { "type": "signal", "to": "<peerId>", "payload": <SDP or ICE> }
 *     { "type": "leave" }
 *
 *   Server → Client:
 *     { "type": "room",         "code": "ABC123", "peerId": "<your-id>" }
 *     { "type": "joined",       "code": "ABC123", "peerId": "<your-id>",
 *                               "hostPeerId": "<host-id>", "peers": [...] }
 *     { "type": "peer-joined",  "peerId": "<id>" }     // broadcast to existing peers
 *     { "type": "peer-left",    "peerId": "<id>" }
 *     { "type": "signal",       "from": "<peerId>", "payload": <...> }
 *     { "type": "error",        "message": "..." }
 */

import { randomBytes } from 'node:crypto';
import { createServer as createHttpServer } from 'node:http';
import type { WebSocket } from 'ws';
import { WebSocketServer } from 'ws';

const PORT = Number(process.env['PORT'] ?? 7777);
const MAX_ROOM_SIZE = 8;
const MAX_MSG_SIZE_BYTES = 8 * 1024;
const MAX_MSGS_PER_SEC = 30;
const ROOM_IDLE_TIMEOUT_MS = 10 * 60 * 1000;

interface PeerConn {
  id: string;
  ws: WebSocket;
  roomCode: string | null;
  msgTimestamps: number[];
  createdAt: number;
  name: string;
}

interface Room {
  code: string;
  hostPeerId: string;
  members: Set<string>;
  createdAt: number;
  lastActivityAt: number;
}

const peers = new Map<string, PeerConn>();
const rooms = new Map<string, Room>();

function genPeerId(): string {
  return randomBytes(8).toString('hex');
}

function genRoomCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let tries = 0; tries < 32; tries++) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)] ?? 'A';
    }
    if (!rooms.has(code)) return code;
  }
  throw new Error('could not allocate unique room code');
}

function send(ws: WebSocket, obj: unknown): void {
  try {
    ws.send(JSON.stringify(obj));
  } catch (err) {
    console.warn('[signaling] send failed', err);
  }
}

function sendError(peer: PeerConn, message: string): void {
  send(peer.ws, { type: 'error', message });
}

function withinRate(peer: PeerConn): boolean {
  const now = Date.now();
  peer.msgTimestamps = peer.msgTimestamps.filter((t) => now - t < 1000);
  if (peer.msgTimestamps.length >= MAX_MSGS_PER_SEC) return false;
  peer.msgTimestamps.push(now);
  return true;
}

function broadcastToRoom(room: Room, exceptPeerId: string, msg: unknown): void {
  for (const peerId of room.members) {
    if (peerId === exceptPeerId) continue;
    const p = peers.get(peerId);
    if (p) send(p.ws, msg);
  }
}

function handleCreate(peer: PeerConn, msg: Record<string, unknown>): void {
  if (peer.roomCode) {
    sendError(peer, 'already in a room');
    return;
  }
  const name = msg['name'];
  if (typeof name === 'string') peer.name = name.slice(0, 32);
  const code = genRoomCode();
  const now = Date.now();
  const room: Room = {
    code,
    hostPeerId: peer.id,
    members: new Set([peer.id]),
    createdAt: now,
    lastActivityAt: now,
  };
  rooms.set(code, room);
  peer.roomCode = code;
  send(peer.ws, { type: 'room', code, peerId: peer.id });
  console.log(`[signaling] room ${code} created by ${peer.id}`);
}

function handleJoin(peer: PeerConn, msg: Record<string, unknown>): void {
  if (peer.roomCode) {
    sendError(peer, 'already in a room');
    return;
  }
  const rawCode = msg['code'];
  if (typeof rawCode !== 'string') {
    sendError(peer, 'missing code');
    return;
  }
  const code = rawCode.toUpperCase();
  const room = rooms.get(code);
  if (!room) {
    sendError(peer, `room ${code} not found`);
    return;
  }
  if (room.members.size >= MAX_ROOM_SIZE) {
    sendError(peer, 'room full');
    return;
  }
  room.members.add(peer.id);
  room.lastActivityAt = Date.now();
  peer.roomCode = room.code;
  send(peer.ws, {
    type: 'joined',
    code: room.code,
    peerId: peer.id,
    hostPeerId: room.hostPeerId,
    peers: Array.from(room.members).filter((id) => id !== peer.id),
  });
  broadcastToRoom(room, peer.id, { type: 'peer-joined', peerId: peer.id });
  console.log(`[signaling] ${peer.id} joined room ${room.code}`);
}

function handleSignal(peer: PeerConn, msg: Record<string, unknown>): void {
  if (!peer.roomCode) {
    sendError(peer, 'not in a room');
    return;
  }
  const to = msg['to'];
  if (typeof to !== 'string') {
    sendError(peer, 'missing signal target');
    return;
  }
  const room = rooms.get(peer.roomCode);
  if (!room?.members.has(to)) {
    sendError(peer, 'target not in room');
    return;
  }
  const target = peers.get(to);
  if (!target) {
    sendError(peer, 'target offline');
    return;
  }
  room.lastActivityAt = Date.now();
  send(target.ws, { type: 'signal', from: peer.id, payload: msg['payload'] });
}

function handleLeave(peer: PeerConn): void {
  if (!peer.roomCode) return;
  const room = rooms.get(peer.roomCode);
  peer.roomCode = null;
  if (!room) return;
  room.members.delete(peer.id);
  if (room.members.size === 0) {
    rooms.delete(room.code);
    console.log(`[signaling] room ${room.code} deleted (empty)`);
  } else {
    broadcastToRoom(room, peer.id, { type: 'peer-left', peerId: peer.id });
  }
}

function handleMessage(peer: PeerConn, raw: string): void {
  if (raw.length > MAX_MSG_SIZE_BYTES) {
    sendError(peer, 'oversized message');
    peer.ws.close(1009, 'oversized');
    return;
  }
  if (!withinRate(peer)) {
    sendError(peer, 'rate limit');
    return;
  }
  let msg: Record<string, unknown>;
  try {
    msg = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    sendError(peer, 'bad json');
    return;
  }
  switch (msg['type']) {
    case 'create':
      handleCreate(peer, msg);
      break;
    case 'join':
      handleJoin(peer, msg);
      break;
    case 'signal':
      handleSignal(peer, msg);
      break;
    case 'leave':
      handleLeave(peer);
      break;
    default:
      sendError(peer, `unknown type: ${String(msg['type'])}`);
  }
}

function sweepIdleRooms(): void {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.lastActivityAt > ROOM_IDLE_TIMEOUT_MS && room.members.size === 0) {
      rooms.delete(code);
      console.log(`[signaling] room ${code} swept (idle)`);
    }
  }
}
setInterval(sweepIdleRooms, 60_000);

const httpServer = createHttpServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({
        ok: true,
        rooms: rooms.size,
        peers: peers.size,
        uptimeSec: process.uptime(),
      }),
    );
    return;
  }
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end('webmc signaling');
});

const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress ?? 'unknown';
  const peer: PeerConn = {
    id: genPeerId(),
    ws,
    roomCode: null,
    msgTimestamps: [],
    createdAt: Date.now(),
    name: '',
  };
  peers.set(peer.id, peer);
  console.log(`[signaling] peer ${peer.id} connected from ${ip} (${peers.size} total)`);

  ws.on('message', (raw: Buffer) => {
    handleMessage(peer, raw.toString('utf8'));
  });
  ws.on('close', () => {
    handleLeave(peer);
    peers.delete(peer.id);
    console.log(`[signaling] peer ${peer.id} disconnected (${peers.size} remain)`);
  });
  ws.on('error', (err) => {
    console.warn(`[signaling] peer ${peer.id} ws error`, err);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[signaling] listening on :${String(PORT)}`);
});
