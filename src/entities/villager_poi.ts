// Villager POI tracker. Villagers bind to a workstation + bed + meeting
// point. Breaking a workstation breaks the profession link.

export type POIKind = 'bed' | 'workstation' | 'meeting_point';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface VillagerPOI {
  kind: POIKind;
  pos: Vec3;
  blockName: string;
}

export interface VillagerBindings {
  bed: VillagerPOI | null;
  workstation: VillagerPOI | null;
  meetingPoint: VillagerPOI | null;
}

export function makeVillagerBindings(): VillagerBindings {
  return { bed: null, workstation: null, meetingPoint: null };
}

export function bindPOI(state: VillagerBindings, poi: VillagerPOI): void {
  if (poi.kind === 'bed') state.bed = poi;
  else if (poi.kind === 'workstation') state.workstation = poi;
  else state.meetingPoint = poi;
}

export function onBlockBroken(state: VillagerBindings, pos: Vec3): void {
  const match = (p: VillagerPOI | null): boolean =>
    p !== null && p.pos.x === pos.x && p.pos.y === pos.y && p.pos.z === pos.z;
  if (match(state.bed)) state.bed = null;
  if (match(state.workstation)) state.workstation = null;
  if (match(state.meetingPoint)) state.meetingPoint = null;
}

export function hasProfession(state: VillagerBindings): boolean {
  return state.workstation !== null;
}
