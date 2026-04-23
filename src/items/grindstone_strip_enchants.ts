export interface Tool {
  enchants: readonly { id: string; level: number }[];
  priorWorkPenalty: number;
  damage: number;
  maxDurability: number;
}

const KEEPS_CURSES = ['curse_of_binding', 'curse_of_vanishing'];

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
      damage: Math.max(0, tool.damage - Math.floor(tool.maxDurability * 0.05)),
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
