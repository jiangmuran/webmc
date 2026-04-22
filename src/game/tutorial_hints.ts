// Tutorial hints. First-run overlays teach basic controls. Each hint
// has a trigger condition (enter world, open inventory, see mob X, etc.)
// and is shown at most once per user; dismissal persists in settings.

export type HintId =
  | 'move'
  | 'look'
  | 'jump'
  | 'break_block'
  | 'place_block'
  | 'open_inventory'
  | 'craft_table'
  | 'sleep_in_bed'
  | 'find_food'
  | 'sprint_jump'
  | 'open_chat'
  | 'open_map'
  | 'use_shield';

export interface HintTrigger {
  id: HintId;
  dependsOn: readonly HintId[]; // can't fire until these are dismissed
  predicate: (ctx: GameContext) => boolean;
  messageKey: string;
}

export interface GameContext {
  hasMoved: boolean;
  hasLooked: boolean;
  hasBrokenBlock: boolean;
  hasPlacedBlock: boolean;
  openedInventory: boolean;
  nearWorkbench: boolean;
  nearBed: boolean;
  hungerBelow: number; // current hunger (0..20)
  usedSprint: boolean;
  usedChat: boolean;
  nearMap: boolean;
  tookProjectileHit: boolean;
}

export const HINT_TRIGGERS: readonly HintTrigger[] = [
  { id: 'move', dependsOn: [], predicate: (c) => !c.hasMoved, messageKey: 'hint.move' },
  { id: 'look', dependsOn: ['move'], predicate: (c) => !c.hasLooked, messageKey: 'hint.look' },
  {
    id: 'break_block',
    dependsOn: ['look'],
    predicate: (c) => !c.hasBrokenBlock,
    messageKey: 'hint.break',
  },
  {
    id: 'place_block',
    dependsOn: ['break_block'],
    predicate: (c) => !c.hasPlacedBlock,
    messageKey: 'hint.place',
  },
  {
    id: 'open_inventory',
    dependsOn: ['place_block'],
    predicate: (c) => !c.openedInventory,
    messageKey: 'hint.inventory',
  },
  {
    id: 'craft_table',
    dependsOn: ['open_inventory'],
    predicate: (c) => c.nearWorkbench,
    messageKey: 'hint.crafting_table',
  },
  { id: 'find_food', dependsOn: [], predicate: (c) => c.hungerBelow <= 10, messageKey: 'hint.eat' },
  { id: 'sleep_in_bed', dependsOn: [], predicate: (c) => c.nearBed, messageKey: 'hint.sleep' },
  {
    id: 'sprint_jump',
    dependsOn: ['move'],
    predicate: (c) => c.usedSprint,
    messageKey: 'hint.sprint_jump',
  },
  { id: 'open_chat', dependsOn: [], predicate: (c) => c.usedChat, messageKey: 'hint.open_chat' },
  {
    id: 'use_shield',
    dependsOn: ['break_block'],
    predicate: (c) => c.tookProjectileHit,
    messageKey: 'hint.shield',
  },
];

export interface HintState {
  dismissed: Set<HintId>;
  currentHintId: HintId | null;
  currentHintShownAtSec: number;
}

export function makeHintState(): HintState {
  return { dismissed: new Set(), currentHintId: null, currentHintShownAtSec: 0 };
}

export function pickNextHint(ctx: GameContext, state: HintState, nowSec: number): HintId | null {
  if (state.currentHintId && nowSec - state.currentHintShownAtSec < 10) {
    return state.currentHintId; // still visible
  }
  for (const t of HINT_TRIGGERS) {
    if (state.dismissed.has(t.id)) continue;
    const depsDone = t.dependsOn.every((d) => state.dismissed.has(d));
    if (!depsDone) continue;
    if (!t.predicate(ctx)) continue;
    state.currentHintId = t.id;
    state.currentHintShownAtSec = nowSec;
    return t.id;
  }
  state.currentHintId = null;
  return null;
}

export function dismissHint(state: HintState, id: HintId): void {
  state.dismissed.add(id);
  if (state.currentHintId === id) state.currentHintId = null;
}
