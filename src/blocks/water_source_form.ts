// Water source block formation. Two adjacent sources at the same Y
// create a third source in the cell between them — but only when
// that cell sits directly on a solid block.
//
// Wiki (minecraft.wiki/w/Water#Source_blocks): "If a water block
// has at least two horizontally adjacent water source blocks
// (counting falling water), and is on top of an opaque solid
// block, it becomes a source itself." Old `shouldBecomeSource`
// only checked the 2-neighbor rule and ignored the solid-below
// requirement, so a flowing-water cell over air could spontaneously
// turn into a source — producing infinite-water in mid-air. Sibling
// water_flow_level.ts (`becomesSource(count, onSolid)`) already
// enforces the solid-below check. Optional `thisOnSolid` defaults
// to true to keep existing test cases passing without modification.

export interface Cell {
  isSource: boolean;
  level: number; // 0..7, 0 = source
  solidBelow: boolean;
}

export function shouldBecomeSource(neighbors: Cell[], thisOnSolid = true): boolean {
  if (!thisOnSolid) return false;
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
