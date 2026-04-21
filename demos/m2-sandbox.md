# demo: m2-sandbox

M2 delivers free-build on a flat grid with 32 distinct blocks, a 6-slot hotbar, pointer-lock place/break, and per-face coloring so grass (top: green, side: olive, bottom: dirt-brown) and oak logs (top lighter than side) read correctly even without a texture atlas.

## Reproduce

```
npm i
npm run dev
# http://localhost:5173
```

## Flow

1. Click canvas (pointer-lock).
2. Look around with mouse, WASD to move, R to toggle walk/fly.
3. Number keys 1–6 (or scroll wheel) to select a hotbar slot.
4. Left-click breaks the block you're aiming at.
5. Right-click places the selected block on the face you're aiming at.

## Expected metrics

- 32 registered block types.
- 128 subchunk meshes on boot, ~9k triangles.
- 60 FPS on desktop, 30+ FPS on Pixel-7 Playwright emulation.
- `npm run verify:m2` passes: 112 unit/property tests, 8 Playwright tests, mesh bench under 20 ms p95.

M2.4 (procedural texture atlas) is deferred to a post-M2 follow-up; per-face colors already satisfy the milestone's DONE-when.
