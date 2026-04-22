// Sneak edge safety. While sneaking, the player cannot walk off a
// block that would cause them to fall (they stop at the edge instead).

export interface EdgeQuery {
  sneaking: boolean;
  onGround: boolean;
  desiredVelocity: { x: number; z: number };
  // returns true if moving by dv would leave the player with no ground.
  wouldFallOffEdge: (dv: { x: number; z: number }) => boolean;
}

export function clampEdgeMove(q: EdgeQuery): { x: number; z: number } {
  if (!q.sneaking || !q.onGround) return q.desiredVelocity;
  // Try axis-aligned subsets to keep the movement that doesn't fall off.
  const tryX = { x: q.desiredVelocity.x, z: 0 };
  const tryZ = { x: 0, z: q.desiredVelocity.z };
  if (q.wouldFallOffEdge(q.desiredVelocity)) {
    if (!q.wouldFallOffEdge(tryX) && !q.wouldFallOffEdge(tryZ)) return q.desiredVelocity;
    if (!q.wouldFallOffEdge(tryX)) return tryX;
    if (!q.wouldFallOffEdge(tryZ)) return tryZ;
    return { x: 0, z: 0 };
  }
  return q.desiredVelocity;
}
