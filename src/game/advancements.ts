// Advancement system. Tracks progress through discrete "tasks" (mine wood,
// craft crafting table, kill a zombie, etc.). Tasks fire events through
// `notify`; each advancement has a trigger predicate plus a parent chain,
// and pushed events may complete multiple at once.

export interface AdvancementDef {
  id: string;
  title: string;
  description: string;
  parentId?: string | undefined;
  trigger: AdvancementTrigger;
  rewardXP?: number;
  rewardItems?: readonly string[];
  hidden?: boolean;
}

export type AdvancementEvent =
  | { kind: 'break_block'; blockName: string }
  | { kind: 'place_block'; blockName: string }
  | { kind: 'craft'; itemName: string }
  | { kind: 'pick_up'; itemName: string }
  | { kind: 'smelt'; itemName: string }
  | { kind: 'kill_mob'; mobKind: string }
  | { kind: 'enter_dim'; dim: string }
  | { kind: 'use_item'; itemName: string }
  | { kind: 'level_up'; level: number }
  | { kind: 'consume'; itemName: string };

export type AdvancementTrigger = (event: AdvancementEvent) => boolean;

// Helpers to build triggers.
export const T = {
  anyBreak: (): AdvancementTrigger => (e) => e.kind === 'break_block',
  breakBlock:
    (name: string): AdvancementTrigger =>
    (e) =>
      e.kind === 'break_block' && e.blockName === name,
  placeBlock:
    (name: string): AdvancementTrigger =>
    (e) =>
      e.kind === 'place_block' && e.blockName === name,
  craft:
    (name: string): AdvancementTrigger =>
    (e) =>
      e.kind === 'craft' && e.itemName === name,
  killMob:
    (kind: string): AdvancementTrigger =>
    (e) =>
      e.kind === 'kill_mob' && e.mobKind === kind,
  enterDim:
    (dim: string): AdvancementTrigger =>
    (e) =>
      e.kind === 'enter_dim' && e.dim === dim,
  consume:
    (name: string): AdvancementTrigger =>
    (e) =>
      e.kind === 'consume' && e.itemName === name,
  reachLevel:
    (n: number): AdvancementTrigger =>
    (e) =>
      e.kind === 'level_up' && e.level >= n,
};

export const ADVANCEMENTS: readonly AdvancementDef[] = [
  {
    id: 'root',
    title: 'Minecraft',
    description: 'The heart and story of the game.',
    trigger: () => false, // manually unlocked
  },
  {
    id: 'stone_age',
    title: 'Stone Age',
    description: 'Mine stone with a pickaxe.',
    parentId: 'root',
    trigger: T.breakBlock('webmc:stone'),
  },
  {
    id: 'getting_wood',
    title: 'Getting Wood',
    description: 'Punch a tree until the blocks of wood pop out.',
    parentId: 'root',
    trigger: T.breakBlock('webmc:oak_log'),
  },
  {
    id: 'benchmaking',
    title: 'Benchmaking',
    description: 'Craft a crafting table.',
    parentId: 'getting_wood',
    trigger: T.craft('webmc:crafting_table'),
  },
  {
    id: 'time_to_mine',
    title: 'Time to Mine!',
    description: 'Craft a pickaxe.',
    parentId: 'benchmaking',
    trigger: T.craft('webmc:wood_pickaxe'),
  },
  {
    id: 'iron_pickaxe',
    title: "Isn't It Iron Pick",
    description: 'Craft an iron pickaxe.',
    parentId: 'time_to_mine',
    trigger: T.craft('webmc:iron_pickaxe'),
  },
  {
    id: 'diamonds',
    title: 'Diamonds!',
    description: 'Acquire diamonds.',
    parentId: 'iron_pickaxe',
    trigger: T.breakBlock('webmc:diamond_ore'),
  },
  {
    id: 'monster_hunter',
    title: 'Monster Hunter',
    description: 'Kill any hostile monster.',
    parentId: 'root',
    trigger: (e) =>
      e.kind === 'kill_mob' &&
      ['zombie', 'skeleton', 'creeper', 'spider', 'enderman'].includes(e.mobKind),
  },
  {
    id: 'the_end',
    title: 'The End?',
    description: 'Enter the End dimension.',
    parentId: 'root',
    trigger: T.enterDim('end'),
  },
  {
    id: 'we_need_to_go_deeper',
    title: 'We Need to Go Deeper',
    description: 'Enter the Nether.',
    parentId: 'root',
    trigger: T.enterDim('nether'),
  },
  {
    id: 'cake_is_a_lie',
    title: 'The Cake is a Lie',
    description: 'Eat a cake slice.',
    parentId: 'benchmaking',
    trigger: T.consume('webmc:cake_slice'),
  },
  {
    id: 'experienced',
    title: 'Experienced',
    description: 'Reach XP level 30.',
    parentId: 'root',
    trigger: T.reachLevel(30),
  },
];

export class AdvancementTracker {
  private readonly completed = new Set<string>();
  private readonly defs: readonly AdvancementDef[];

  constructor(defs: readonly AdvancementDef[] = ADVANCEMENTS) {
    this.defs = defs;
  }

  notify(event: AdvancementEvent): readonly AdvancementDef[] {
    const newly: AdvancementDef[] = [];
    for (const d of this.defs) {
      if (this.completed.has(d.id)) continue;
      // Require parent completion before a child can trigger.
      if (d.parentId && d.parentId !== 'root' && !this.completed.has(d.parentId)) continue;
      if (d.trigger(event)) {
        this.completed.add(d.id);
        newly.push(d);
      }
    }
    return newly;
  }

  has(id: string): boolean {
    return this.completed.has(id);
  }

  progress(): number {
    return this.completed.size;
  }

  total(): number {
    return this.defs.length;
  }

  serialize(): string[] {
    return Array.from(this.completed);
  }

  hydrate(ids: readonly string[]): void {
    for (const id of ids) this.completed.add(id);
  }
}
