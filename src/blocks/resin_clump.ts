// Resin clumps appear on pale oak logs where a creaking died. Harvestable
// to obtain resin, crafted into resin bricks.

export interface ResinClumpState {
  size: 1 | 2 | 3 | 4;
}

export function onCreakingDeath(): ResinClumpState {
  return { size: 1 };
}

export function accumulate(s: ResinClumpState): ResinClumpState {
  if (s.size >= 4) return s;
  return { size: (s.size + 1) as 1 | 2 | 3 | 4 };
}

export function harvest(s: ResinClumpState): { resin: number } {
  return { resin: s.size };
}

export function canCraftResinBrick(resinCount: number): boolean {
  return resinCount >= 4;
}
