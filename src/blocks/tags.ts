// Block + item tags. Lightweight tag system for datapack / recipe
// matching. A tag is a named set of block-or-item names; tags can
// reference other tags.

export class TagRegistry {
  private readonly tags = new Map<string, Set<string>>();

  define(tag: string, members: readonly string[]): void {
    const set = this.tags.get(tag) ?? new Set<string>();
    for (const m of members) set.add(m);
    this.tags.set(tag, set);
  }

  extend(tag: string, members: readonly string[]): void {
    this.define(tag, members);
  }

  // Nested tag references use "#tag" prefix. Expands transitively.
  contains(tag: string, name: string): boolean {
    const set = this.tags.get(tag);
    if (!set) return false;
    if (set.has(name)) return true;
    for (const m of set) {
      if (m.startsWith('#') && this.contains(m.slice(1), name)) return true;
    }
    return false;
  }

  all(tag: string): readonly string[] {
    const out = new Set<string>();
    const set = this.tags.get(tag);
    if (!set) return [];
    const visit = (t: string): void => {
      const inner = this.tags.get(t);
      if (!inner) return;
      for (const m of inner) {
        if (m.startsWith('#')) visit(m.slice(1));
        else out.add(m);
      }
    };
    for (const m of set) {
      if (m.startsWith('#')) visit(m.slice(1));
      else out.add(m);
    }
    return Array.from(out);
  }
}

// Standard block tags shipped with webmc.
export function registerStandardTags(reg: TagRegistry): void {
  reg.define('planks', [
    'webmc:oak_planks',
    'webmc:spruce_planks',
    'webmc:birch_planks',
    'webmc:jungle_planks',
    'webmc:acacia_planks',
    'webmc:dark_oak_planks',
    'webmc:mangrove_planks',
    'webmc:cherry_planks',
  ]);
  reg.define('logs', [
    'webmc:oak_log',
    'webmc:spruce_log',
    'webmc:birch_log',
    'webmc:jungle_log',
    'webmc:acacia_log',
    'webmc:dark_oak_log',
    'webmc:mangrove_log',
    'webmc:cherry_log',
    'webmc:stripped_oak_log',
  ]);
  reg.define('wool', [
    'webmc:wool_white',
    'webmc:wool_orange',
    'webmc:wool_magenta',
    'webmc:wool_light_blue',
    'webmc:wool_yellow',
    'webmc:wool_lime',
    'webmc:wool_pink',
    'webmc:wool_gray',
    'webmc:wool_light_gray',
    'webmc:wool_cyan',
    'webmc:wool_purple',
    'webmc:wool_blue',
    'webmc:wool_brown',
    'webmc:wool_green',
    'webmc:wool_red',
    'webmc:wool_black',
  ]);
  reg.define('doors', [
    'webmc:oak_door',
    'webmc:spruce_door',
    'webmc:birch_door',
    'webmc:jungle_door',
    'webmc:iron_door',
  ]);
  reg.define('flowers', [
    'webmc:poppy',
    'webmc:dandelion',
    'webmc:blue_orchid',
    'webmc:allium',
    'webmc:azure_bluet',
    'webmc:cornflower',
    'webmc:lily_of_the_valley',
    'webmc:wither_rose',
  ]);
  reg.define('stone_crafting_materials', [
    'webmc:stone',
    'webmc:cobblestone',
    'webmc:cobbled_deepslate',
  ]);
  reg.define('fence_gates', [
    'webmc:oak_fence_gate',
    'webmc:spruce_fence_gate',
    'webmc:birch_fence_gate',
  ]);
}
