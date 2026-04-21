# M6 — Multiplayer MVP (Design Note)

**Master Plan reference:** M6 — `~30h honest`. DONE-when = two browsers join via room code, both build, edits echo <500ms p50, host-leave shows clean end screen.

Locked architecture decisions (from the Master Plan):

- Self-hosted Node/Bun WebSocket signaling (user's choice, committed at brainstorming 2026-04-21).
- Host-authoritative peer model: first joiner simulates; others are clients with prediction+reconciliation.
- WebRTC DataChannels: unreliable+unordered for 30Hz position/entity, reliable+ordered for edits/inventory/chat.
- Hand-rolled bit-packed binary codec (~200 LoC).

## Sub-tasks

```
M6.1  Binary codec (encoder/decoder/validator + fuzz)     [3h]  pure fn
M6.2  Signaling server (Node/Bun WS + Docker)             [3h]
M6.3  WebRTC transport (STUN/TURN/WS-relay fallback)     [3h]
M6.4  Host-authoritative tick loop + snapshot broadcast   [3h]
M6.5  Client prediction + reconciliation (position)       [3h]
M6.6  Chunk streaming with backpressure                   [3h]
M6.7  Block-edit propagation + chat                       [2h]
M6.8  Remote player avatars + nametags                    [2h]
M6.9  Room codes in URL + join UI                         [2h]
M6.10 Rate limiting + schema validation                   [1.5h]
M6.11 Host-leave clean end + reconnect                    [2h]
M6.12 Playwright 2-peer e2e                               [2h]
M6.13 verify:m6 + retro + close                           [1.5h]
```

Honest ~30 h.

## Wire format (message types, 1-byte tag)

```
0x01 HELLO       u32 protoVer | u64 playerId | str16 name
0x02 WELCOME     u64 worldSeed | u32 tick | u16 chunkCount
0x10 INPUT       u32 tick | f32[3] move | u8 buttons               (unreliable, 30 Hz)
0x11 STATE_DELTA u32 tick | varint count | {entId:varint, flags:u8, fields}  (unreliable)
0x20 BLOCK_EDIT  u32 tick | {x:i24, y:i16, z:i24, block:u16, meta:u8}[]  (reliable)
0x21 CHUNK_FULL  i24 cx | i24 cz | u8 sectionMask | bytes (ChunkBlob payload)  (reliable)
0x22 CHUNK_DELTA i24 cx | i24 cz | varint count | {x,y,z,block,meta}[]  (reliable)
0x30 CHAT        str240 text
0x40 INVENTORY   u8 slot | u16 item | u16 count | u16 meta
0xF0 PING / 0xF1 PONG
```

All little-endian. Strings as u16 length + UTF-8 bytes. Varints are LEB128.

## Signaling server

Node (not Bun — Bun is still flaky on some mobile ISPs; Node 20 is boring-stable). Single-file script (~150 LoC) with:

- `ws` package for WebSocket.
- In-memory `Map<roomCode, Set<WebSocket>>`.
- Protocol: `{type: 'create', name}` → server returns room code. `{type: 'join', code}` → server relays all SDP offer/answer/ICE between the two peers. No game traffic.
- Rate limit: 30 msg/s per connection, 5 rooms/min per IP.
- Ships with Dockerfile + docker-compose.yml. Can also run `npm run signaling` locally.

## Transport abstraction

```ts
interface Transport {
  send(channel: 'reliable' | 'unreliable', bytes: Uint8Array): void;
  onMessage(cb: (channel: 'reliable' | 'unreliable', bytes: Uint8Array) => void): void;
  close(): void;
}
```

Two implementations: `WebRTCTransport` (DataChannel-backed), `WebSocketTransport` (fallback via signaling server relay). Both behind the same interface so M6.4+ don't care which is live.

## DONE (per STANDARDS.md §2.1)

1. `npm run signaling` starts the WS server; open `/` in two tabs on same LAN; create room, join with code, both see same world, place blocks echo across.
2. `npm run verify:m6` green: codec fuzz + transport smoke + 2-peer Playwright.
3. `/demos/m6-lan-coop.md`.
4. Retro.
