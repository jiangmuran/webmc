export type Mode = 'save' | 'load' | 'corner' | 'data';

export interface StructureBlock {
  mode: Mode;
  name: string;
  posX: number;
  posY: number;
  posZ: number;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
}

export function canSave(b: StructureBlock): boolean {
  return b.mode === 'save' && b.sizeX > 0 && b.sizeY > 0 && b.sizeZ > 0;
}

export function canLoad(b: StructureBlock): boolean {
  return b.mode === 'load' && b.name.length > 0;
}

export function isCornerMarker(b: StructureBlock): boolean {
  return b.mode === 'corner';
}
