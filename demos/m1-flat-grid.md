# demo: m1-flat-grid

M1's headline feature is "walk an 8×8 chunk voxel world at 60 FPS". The save format doesn't exist yet (lands in M5), so this demo is runtime-generated instead of loaded from disk.

## Reproduce

```
npm i
npm run dev
# open http://localhost:5173
```

## What to expect

- 8×8 column of subchunks around the origin.
- Flat terrain: 2 stone layers, 2 dirt, 1 grass on top.
- Scattered: glowstone specks, oak-log pillars (4-tall), short cobblestone mounds.
- Click the canvas to capture the pointer.
- WASD to move. Mouse to look. Space/Shift for up/down (fly mode). R to toggle walk/fly.
- Walk mode applies gravity, jump, AABB collision against voxels.
- HUD at top-left shows renderer, FPS, frame ms, position, look vector, chunk & triangle counts, mode.

## Expected metrics on a 2020+ desktop

- ~128 chunk meshes
- ~9 000 triangles
- Steady 60 FPS (vsync)
- ~16 ms/frame

When M5 ships, this fixture becomes a real `.webmc` file. Until then, this doc is the demo.
