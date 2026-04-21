# M5 — Persistent Saves (Design Note)

**Master Plan reference:** M5 — `~15h`. DONE-when = close tab, reopen, resume exactly; export/re-import yields identical state.

Read: `AGENT_CHARTER.md` + `docs/STANDARDS.md` + `docs/phase-retros/m4.md`.

Clean-room: our save format is webmc-native, not Anvil. We reference the wiki `Chunk_format.wikitext` for *conceptual* guidance (palette + bitpacked is the pattern) but every byte of our schema is original.

## Sub-tasks

```
M5.1  IndexedDB schema + typed DAL                        [2h]
M5.2  Chunk serialization v1 (palette + bitpacked + light) [2h]
M5.3  Zstd-via-wasm compression wrapper                    [1.5h]
M5.4  Dirty-chunk writeback queue                          [2h]
M5.5  World selector UI (list / create / load / delete)   [2h]
M5.6  .webmc zip export/import                             [2h]
M5.7  Versioned schema migrations scaffold                 [1h]
M5.8  Tests: round-trip, quota, migration                  [1.5h]
M5.9  Playwright reload e2e                                [1h]
M5.10 verify:m5 + retro + close                            [1h]
```

Honest total ~16 h. ±30%.

## IndexedDB schema

Database `webmc`, version 1:

- `worlds` — `{id, name, seed, createdAt, updatedAt, schemaVersion, spawn:{x,y,z}}`. keyPath `id`.
- `chunks` — `{worldId, cx, cz, payload: Blob, version}`. keyPath `[worldId, cx, cz]`.
- `player` — `{worldId, position, yaw, pitch, hotbar[], selectedSlot}`. keyPath `worldId`.
- `meta` — kv `{k: string, v: unknown}` for dev flags + 'lastPlayedWorldId'.

## Serialization v1

Per chunk, a single compressed blob with this layout:

```
Header (32 bytes):
  u32 magic            0x57454243 ("WEBC")
  u16 schemaVersion    1
  u16 flags            bit 0 = light baked
  u32 cx, u32 cz       (signed, little-endian)
  u32 sectionMask      bit i = section i is present
  u32 payloadLength    bytes after header, pre-compression

Section payloads (for each bit set in sectionMask):
  u8 bitsPerIndex      0 | 4 | 8 | 16
  u16 paletteSize
  u32[paletteSize] paletteStates   (BlockState u32s)
  if bitsPerIndex > 0:
    u32[ceil(4096 * bitsPerIndex / 32)] indices
  u8[4096] lightPacked              (sky<<4 | block)  (if flags bit 0)

Trailer:
  u32 crc32 of header+sections
```

The blob is then zstd-level-3 compressed. Typical chunk (~14 loaded sections, mixed terrain) ≈ 1.5 KB after compression.

## Compression

Use `@oneidentity/zstd-js` (wasm, ~50 KB). API: `compress(Uint8Array) → Uint8Array`, `decompress(Uint8Array) → Uint8Array`. Mutate the DB blob as `Blob([zstdBytes])`.

Fallback if zstd fails to load: uncompressed raw blob with a different magic (`0x57454252` "WEBR"). Decoder checks magic, branches.

## Dirty writeback queue

Chunks are marked dirty by `World.set` already. A background timer every 1000 ms flushes all dirty chunks to IndexedDB in an index-transaction batch. `visibilitychange` (tab hidden) flushes immediately. Cap batch at 32 chunks per flush to keep the transaction short.

## World selector

DOM modal shown pre-game: list of worlds, "New World" button (prompts seed + name), "Load" / "Delete" / "Export" / "Import". After `Load`, the main game boots with that `worldId`.

## .webmc export/import

Zip container (`client-zip` for writing, `fflate` for reading; both MIT, ~6 KB combined):

```
world.json     { id, name, seed, schemaVersion, exportedAt, spawn }
player.json
chunks/<cx>_<cz>.zst
```

Import: detects schema mismatch, runs migrations, assigns a new local `worldId`.

## Migrations

`persistence/migrations/` with files named `v1_to_v2.ts`, `v2_to_v3.ts`, etc. Each exports `migrate(db: IDBDatabase, from: number, to: number): Promise<void>`. Called on `IDBDatabase.upgradeneeded` and on `.webmc` import.

## Quota strategy

`navigator.storage.estimate()` checked at startup and after each flush. If < 100 MB free, warn the user via a toast and offer to export the oldest world. LRU eviction beyond a visited-spawn radius is a post-M5 backlog item.

## DONE (per STANDARDS.md §2.1)

1. Build world → place distinctive block tower → close tab → reopen → pick world → resume at same position → tower present.
2. Export → wipe IDB via devtools → import → identical state.
3. `npm run verify:m5` green.
4. Retro + demo.
