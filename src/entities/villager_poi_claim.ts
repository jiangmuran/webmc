// Villager POI claim. Each villager claims a bed (home) and a workstation
// (job site). POIs can be claimed by only one villager at a time.

export type PoiType = 'bed' | 'workstation' | 'meeting_point';

export interface Poi {
  id: string;
  type: PoiType;
  claimedBy: string | null;
}

export function claim(p: Poi, villagerId: string): boolean {
  if (p.claimedBy !== null && p.claimedBy !== villagerId) return false;
  p.claimedBy = villagerId;
  return true;
}

export function release(p: Poi, villagerId: string): boolean {
  if (p.claimedBy !== villagerId) return false;
  p.claimedBy = null;
  return true;
}

export function isFree(p: Poi): boolean {
  return p.claimedBy === null;
}

export function countClaimedBy(pois: Poi[], villagerId: string): number {
  let n = 0;
  for (const p of pois) if (p.claimedBy === villagerId) n++;
  return n;
}
