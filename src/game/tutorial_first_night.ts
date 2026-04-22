// Tutorial hints for new players on the first night. Triggered by
// achievements: first break log, first craft planks, etc.

export type HintId =
  | 'welcome'
  | 'break_tree'
  | 'craft_planks'
  | 'craft_sticks'
  | 'craft_crafting_table'
  | 'make_pickaxe'
  | 'mine_stone'
  | 'build_shelter'
  | 'fight_mobs';

export interface Hint {
  id: HintId;
  order: number;
  triggerEvent: string;
}

const HINTS: Hint[] = [
  { id: 'welcome', order: 0, triggerEvent: 'world_loaded' },
  { id: 'break_tree', order: 1, triggerEvent: 'spawn_finished' },
  { id: 'craft_planks', order: 2, triggerEvent: 'collected_log' },
  { id: 'craft_sticks', order: 3, triggerEvent: 'collected_planks' },
  { id: 'craft_crafting_table', order: 4, triggerEvent: 'collected_planks' },
  { id: 'make_pickaxe', order: 5, triggerEvent: 'placed_crafting_table' },
  { id: 'mine_stone', order: 6, triggerEvent: 'made_wooden_pickaxe' },
  { id: 'build_shelter', order: 7, triggerEvent: 'collected_cobblestone' },
  { id: 'fight_mobs', order: 8, triggerEvent: 'sunset' },
];

export class TutorialState {
  shown = new Set<HintId>();

  fire(event: string): HintId[] {
    const out: HintId[] = [];
    for (const h of HINTS) {
      if (h.triggerEvent === event && !this.shown.has(h.id)) {
        this.shown.add(h.id);
        out.push(h.id);
      }
    }
    return out;
  }

  done(): boolean {
    return HINTS.every((h) => this.shown.has(h.id));
  }
}
