# M4 — Mobile + Audio + Polish (Design Note)

**Master Plan reference:** M4 — `~15h`. DONE-when = iOS Safari / Android Chrome users can open URL, walk, build, and hear spatial audio at ≥ 30 FPS on a 2022-era mid-range phone.

Read: `AGENT_CHARTER.md` + `docs/STANDARDS.md` + `docs/phase-retros/m3.md`.

## Sub-tasks

```
M4.1  Input abstraction + virtual joystick + look pad + HUD buttons  [3h]
M4.2  Responsive UI (CSS vars, hotbar stays thumb-reachable)         [1.5h]
M4.3  Dynamic-quality throttle (auto-drop view distance on lag)      [2h]
M4.4  Settings panel: FOV / view distance / sensitivity / audio     [1.5h]
M4.5  Web Audio wrapper + user-gesture unlock                        [1h]
M4.6  Footstep / place / break / ambient sounds (CC0, procedural)    [2h]
M4.7  Positional audio attenuation                                   [1h]
M4.8  Mobile QA matrix + perf floor test                             [1h]
M4.9  Playwright mobile e2e                                          [1h]
M4.10 verify:m4 + retro + close                                      [1h]
```

Honest total ~15 h.

## Input abstraction

```ts
interface InputSource {
  readonly kind: 'keyboard-mouse' | 'touch' | 'gamepad';
  readonly state: InputState;
}

interface InputState {
  move: { x: number; z: number };  // -1..1 each axis (walk / strafe)
  look: { dx: number; dy: number };  // delta per frame (mouse movement equiv)
  jump: boolean;
  sprint: boolean;
  primary: boolean;   // break / attack
  secondary: boolean; // place / use
  toggles: { fly: boolean; inventory: boolean };
}
```

`CompositeInputSource` merges whichever sources are live. Touch activates on first `touchstart`. Keyboard stays live even when touch is active.

## Touch UI

Two regions:

- **Left half** virtual joystick. Touch → joystick base appears at touch start; drag → `move` vector in a 0.75R radius.
- **Right half** look pad. Drag → `look.dx`/`look.dy` directly map from pixel deltas (sensitivity-scaled). Single tap (no drag) → secondary (place). Two-finger tap → primary (break). Or we add explicit buttons near the bottom-right.
- **Bottom-right button cluster**: 💥 break, ➕ place, ⬆️ jump, ⚙️ settings. 48×48 CSS px each, thumb-reach.

## Dynamic quality

Rolling p95 of last 60 frames' `frameMs`. If > 33 for ≥ 3 s:

1. Drop `viewRadius` by 1 (floor at 3).
2. If still bad, set `uAmbient` to 0.2 and disable fog distance tapering (no visible change beyond 4 chunks).
3. Recovery: if p95 < 22 ms for 10 s, restore one level.

## Settings

Simple DOM panel with sliders. Persisted to `localStorage` under `webmc.settings.v1`:

- FOV (60–100°)
- View distance (3–12 chunks)
- Look sensitivity
- Master volume

Toggled with ⚙️ button or `Esc` key.

## Audio

- `AudioBus` wraps `AudioContext`, unlocks on first user interaction (pointer-lock click or touch).
- Load a handful of CC0 WAVs from `/public/audio/` (project-authored in a follow-up; initial set is procedurally synthesized clicks so the repo ships no third-party audio).
- `play3D(name, position, volume)` — attenuates by distance to camera, lerped to mute past 16 m.
- Hook `InteractionController` to play `break` / `place`.

## Mobile perf floor

Add a perf bench that boots the dev server in a Playwright Pixel-7 emulation, measures FPS over 5 s, asserts ≥ 20. If this fails in CI, M4 isn't DONE.

## DONE (per STANDARDS.md §2.1)

1. `npm run dev` on a Pixel-7 emulation — walk, build, jump, hear audio at ≥ 30 FPS.
2. `npm run verify:m4` green: all prior + settings persistence unit + mobile flyover e2e + audio unlock e2e.
3. Review sub-agent sign-off.
4. `/demos/m4-mobile.md`.
5. Retro.
