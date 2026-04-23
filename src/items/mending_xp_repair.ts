export const DURABILITY_PER_XP_UNIT = 2;

export function repairAmount(xpUnits: number): number {
  return Math.max(0, Math.floor(xpUnits * DURABILITY_PER_XP_UNIT));
}

export function pickItemForRepair(
  items: { id: string; durability: number; max: number; hasMending: boolean }[],
): number | undefined {
  const eligible = items
    .map((i, idx) => ({ i, idx }))
    .filter(({ i }) => i.hasMending && i.durability < i.max);
  if (eligible.length === 0) return undefined;
  const pick = eligible[Math.floor(Math.random() * eligible.length)];
  return pick?.idx;
}
