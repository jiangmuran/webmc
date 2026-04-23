export type Face = 'px' | 'nx' | 'py' | 'ny' | 'pz' | 'nz';

export function shouldCullFace(
  blockId: string,
  neighborId: string,
  transparentIds: ReadonlySet<string>,
): boolean {
  if (neighborId === 'air') return false;
  if (blockId === neighborId) return true;
  return !transparentIds.has(neighborId);
}

export function facesToRender(
  blockId: string,
  neighbors: Record<Face, string>,
  transparentIds: ReadonlySet<string>,
): readonly Face[] {
  const faces: Face[] = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
  return faces.filter((f) => !shouldCullFace(blockId, neighbors[f], transparentIds));
}
