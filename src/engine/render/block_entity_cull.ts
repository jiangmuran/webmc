export interface BlockEntity {
  x: number;
  y: number;
  z: number;
  visible?: boolean;
}

export const RENDER_DISTANCE = 64;

export function inRenderRange(
  be: BlockEntity,
  cameraX: number,
  cameraY: number,
  cameraZ: number,
): boolean {
  return Math.hypot(be.x - cameraX, be.y - cameraY, be.z - cameraZ) <= RENDER_DISTANCE;
}

export function cullList(
  list: readonly BlockEntity[],
  cameraX: number,
  cameraY: number,
  cameraZ: number,
): readonly BlockEntity[] {
  return list.filter((be) => inRenderRange(be, cameraX, cameraY, cameraZ));
}

export function visibleCount(list: readonly BlockEntity[]): number {
  return list.filter((be) => be.visible !== false).length;
}
