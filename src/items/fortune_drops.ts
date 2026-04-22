// Fortune enchantment (pickaxe/axe/shovel/hoe). Increases drops from
// certain blocks (ores, crops, sea lanterns, glowstone).

export const FORTUNE_MAX_LEVEL = 3;

// Generic discrete-ore drop: (0..1)+level bonus rolls, pick max+1 (MC logic).
export function oreDrops(level: number, rand: () => number): number {
  if (level <= 0) return 1;
  const rolls = Math.floor(rand() * (level + 2)) - 1;
  return Math.max(1, rolls + 1);
}

// For blocks that drop 1..N items (wheat, carrots, nether wart), fortune
// uses binomial trials.
export function cropBonusDrops(level: number, rand: () => number): number {
  let extras = 0;
  for (let i = 0; i < level; i++) if (rand() < 0.5714) extras++;
  return extras;
}

export function supports(toolKind: string): boolean {
  return (
    toolKind === 'pickaxe' || toolKind === 'axe' || toolKind === 'shovel' || toolKind === 'hoe'
  );
}
