// Water source block formation. Two adjacent sources at the same Y
// create a third source in the cell between them (classic MC behavior).

export interface Cell {
  isSource: boolean;
  level: number; // 0..7, 0 = source
  solidBelow: boolean;
}

export function shouldBecomeSource(neighbors: Cell[]): boolean {
  const sources = neighbors.filter((n) => n.isSource).length;
  return sources >= 2;
}

export function flowLevelFrom(fromLevel: number): number {
  return Math.min(7, fromLevel + 1);
}

export function canFlow(target: Cell): boolean {
  return !target.isSource && target.level > 0;
}

// Water above solid → horizontal flow only; above air → falls.
export function waterFalls(aboveCellIsAir: boolean): boolean {
  return aboveCellIsAir;
}
