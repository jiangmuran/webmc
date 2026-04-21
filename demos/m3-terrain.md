# demo: m3-terrain

M3 introduces infinite streamed terrain with biomes, lighting, and a day-night cycle.

## Reproduce

```
npm i
npm run dev
# http://localhost:5173
```

## Flow

1. On boot, the world streams a 6-chunk radius around spawn (surface height derived from seed).
2. Fly around with WASD + Space/Shift (fly mode is default).
3. Dig a cave with left-click into any hillside — the cave interior is dark (skyLight = 0 under the topmost opaque block).
4. Place glowstone (hotbar slot 9 by default) inside the cave — BFS block-light propagates ~13 blocks with visible attenuation.
5. Wait about 5 minutes for the sun to set — sky fades through dusk orange into night navy, ambient drops to 0.04, and block-light dominates visibility.

## Expected metrics

- 6-chunk view radius on desktop, streaming in 4 chunks/frame.
- Steady 60 FPS desktop, ≥ 30 FPS on Pixel-7 emulation after initial stream-in.
- 145 unit tests green, 12 Playwright scenarios green (4 specs × desktop + mobile).
- Deterministic world: seed `0xabc1234` produces the exact same terrain on every boot.

Known trade-offs (deferred to backlog):

- No vertex AO; corners look flat under harsh sun.
- No cross-chunk light bleed; tall overhangs show a seam on chunk borders.
- No biome-tint for grass/leaves.
