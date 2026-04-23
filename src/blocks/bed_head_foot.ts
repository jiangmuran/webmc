export type BedPart = 'head' | 'foot';

export interface Ctx {
  thisPart: BedPart;
  adjacentPart?: BedPart;
}

export function canSleep(c: Ctx): boolean {
  return c.adjacentPart !== undefined && c.adjacentPart !== c.thisPart;
}

export function breakingHeadRemovesFoot(part: BedPart): boolean {
  return true;
}

export function occupiedFlagShared(): boolean {
  return true;
}
