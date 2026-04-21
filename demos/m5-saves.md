# demo: m5-saves

M5 adds IndexedDB-backed persistence. Close the tab and reopen — the world is still there at your last position.

## Reproduce

```
npm i
npm run dev
# http://localhost:5173
```

1. Click the canvas, walk/fly around, place and break some blocks.
2. Wait ~5 seconds (periodic save) or hide the tab (triggers immediate save).
3. Close the tab or reload the page.
4. Reopen the URL — player drops back to last saved position, world state (terrain + your edits) intact.

## Expected metrics

- First boot: creates `default-world` meta row, starts generating + saving chunks as streaming loads them.
- HUD shows `save<N>` where N is pending dirty chunks; drops to 0 within 1 s.
- Reload: first `tris` reading ≥ 100 within 20 s (loading from IDB is faster than generating).
- `npm run verify:m5` green: 163 unit tests + 16 Playwright scenarios (including dedicated persistence + save-counter tests on desktop + Pixel-7 emulation).

## Deferred (see backlog.md Post-M5)

- zstd compression of chunk payloads.
- World selector UI (create / load / delete multiple worlds).
- `.webmc` zip export/import for portability.
- Versioned-migration scaffold (for when schema v2 ships).
