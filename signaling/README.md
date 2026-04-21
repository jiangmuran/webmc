# webmc signaling

Minimal Node + ws WebSocket relay for WebRTC negotiation. Never sees game traffic; it only exchanges SDP offers/answers and ICE candidates between peers so they can establish DataChannels directly.

## Run locally

```
npm run signaling
# or: PORT=7777 node --experimental-strip-types signaling/server.ts
```

Health check: `GET /health` returns `{ok, rooms, peers, uptimeSec}`.

## Deploy via Docker

```
docker build -f signaling/Dockerfile -t webmc-signaling .
docker run -p 7777:7777 webmc-signaling
```

## Protocol

JSON messages, one per WebSocket frame, ≤ 8 KB each.

| Client → Server                                     | Server → Client                                            |
| --------------------------------------------------- | ---------------------------------------------------------- |
| `{type:'create', name:'...'}`                       | `{type:'room', code:'ABC123', peerId:'<you>'}`             |
| `{type:'join',   code:'ABC123'}`                    | `{type:'joined', code, peerId, hostPeerId, peers:[...]}`   |
|                                                     | `{type:'peer-joined', peerId}` broadcast to existing peers |
|                                                     | `{type:'peer-left',   peerId}`                             |
| `{type:'signal', to:'<peerId>', payload:<SDP/ICE>}` | `{type:'signal', from:'<peerId>', payload:<...>}`          |
| `{type:'leave'}`                                    |                                                            |
|                                                     | `{type:'error', message:'...'}`                            |

## Limits

- 8 peers per room.
- 30 messages/sec per peer.
- 8 KB per message.
- Idle empty rooms swept after 10 min.
- Room codes: 6 chars from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (no I, O, 0, 1 — readable over phone).
