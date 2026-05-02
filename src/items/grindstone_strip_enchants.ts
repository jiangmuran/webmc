export interface Tool {
  enchants: readonly { id: string; level: number }[];
  priorWorkPenalty: number;
  damage: number;
  maxDurability: number;
}

const KEEPS_CURSES = ['curse_of_binding', 'curse_of_vanishing'];

// Wiki (minecraft.wiki/w/Grindstone): "Disenchanting a single item:
// removes non-curse enchantments. Output durability equals input
// durability." The 5% repair bonus applies ONLY when combining two
// items in the grindstone (see combineTwoRepair).
//
// Old `grind` repaired 5% of max durability on single-item grinds —
// non-vanilla. Players could double-grind for free repair without
// needing the two-item combine.
export function grind(tool: Tool): {
  result: Tool;
  xpDropped: number;
} {
  const kept = tool.enchants.filter((e) => KEEPS_CURSES.includes(e.id));
  const stripped = tool.enchants.filter((e) => !KEEPS_CURSES.includes(e.id));
  const xp = stripped.reduce((s, e) => s + e.level * 3, 0);
  return {
    result: {
      enchants: kept,
      priorWorkPenalty: 0,
      damage: tool.damage,
      maxDurability: tool.maxDurability,
    },
    xpDropped: xp,
  };
}

export function combineTwoRepair(a: Tool, b: Tool): Tool {
  const combinedRepair =
    a.maxDurability - a.damage + (b.maxDurability - b.damage) + Math.floor(a.maxDurability * 0.05);
  return {
    enchants: a.enchants.filter((e) => KEEPS_CURSES.includes(e.id)),
    priorWorkPenalty: 0,
    damage: Math.max(0, a.maxDurability - combinedRepair),
    maxDurability: a.maxDurability,
  };
}
