# Milestone demos

Each milestone commits a one-click demo artifact under `/demos/m<N>-<slug>.<ext>`. A reviewer with the repo checked out and `npm run dev` running can open the demo and see the milestone's headline feature in ≤ 30 seconds.

Format evolves with the project:

- **M0** — no artifact. The demo is `npm run dev` → localhost:5173 → canvas with FPS HUD. This milestone is scaffold only; there is no world state to save yet.
- **M2+** — `.webmc` zip (world save format, shipped with M5). Drag-drop into the world selector to load.
- **M8 onward** — demo saves include shipped circuits, mobs, or other feature showcases (e.g. `m8-redstone-door.webmc`).

The agent writes the demo as part of the milestone's DONE gate (see `docs/STANDARDS.md §2.1`).
