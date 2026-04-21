# demo: m4-mobile

M4 adds touch input and procedurally-synthesized audio.

## Reproduce (desktop)

```
npm run dev
# http://localhost:5173
```

Desktop behavior is unchanged: WASD + mouse + pointer-lock + click-to-break / right-click-to-place. Audio unlocks on first click; you should hear a short square-wave thud when breaking blocks and a brighter triangle bloop when placing.

## Reproduce (mobile)

Open the same URL on an iOS / Android phone on the same network:

```
# note the Vite-reported network URL, e.g. http://192.168.x.y:5173
```

- Drag the left half of the screen to show the virtual joystick and walk.
- Drag the right half to look around.
- Bottom-right buttons: break the block you're aimed at, place the selected hotbar block, jump.
- Hotbar still works via scroll gestures on the remaining horizontal strip (number keys obviously unavailable on touch-only).

## Expected metrics

- 145 unit tests, 12 e2e scenarios, all green on desktop + Pixel-7 emulation.
- Audio unlocks reliably on first tap; silent thereafter until a placement or break occurs.
- Break/place sound attenuates audibly when you move away from the source.

## Deferred

See `backlog.md` under "Post-M4" for settings panel, dynamic quality, footstep cadence.
