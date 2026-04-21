# demo: m6-coop

M6 adds multiplayer co-op via WebRTC DataChannels + a self-hosted signaling relay.

## Reproduce

```
npm i
npm run signaling                  # terminal 1: WebSocket signaling on :7777
npm run dev                        # terminal 2: Vite dev on :5173

# browser tab 1 (host):
open http://localhost:5173/?mp=create

# HUD shows "room ABC123" — send that code to a friend.

# browser tab 2 (guest, from any device on the LAN):
open http://<host-ip>:5173/?mp=ABC123
```

Both tabs generate the same seed (persistence is shared per origin via IDB, new world when none exists). When the host places or breaks a block, MPSession broadcasts a BLOCK_EDIT over the reliable DataChannel; the guest applies it. Guest edits flow to the host, which rebroadcasts to all other peers.

## Expected metrics

- `npm run verify:m6` green: 189 unit tests, 18 Playwright scenarios (incl. the 2-peer create-join handshake).
- Signaling server uses < 20 MB RAM, 0 CPU while idle, < 1 MB/s at 30 msg/s/peer steady-state (signaling only; game traffic goes peer-to-peer via DataChannels).

## Deferred (see backlog.md Post-M6)

- Chunk streaming on join (guest doesn't inherit host's edited chunks yet).
- Client prediction + reconciliation for remote player motion.
- Remote-player avatars + chat UI.
- Host-migration when the host drops.
- Client-side rate limiting + per-message-type validation.
