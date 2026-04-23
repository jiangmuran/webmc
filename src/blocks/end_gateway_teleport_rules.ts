export interface GatewayCtx {
  sourceX: number;
  sourceZ: number;
}

export const OUTER_RADIUS = 1000;
export const INNER_CLEAR_RADIUS = 100;

export function teleportTarget(rng: () => number): { x: number; z: number } {
  const angle = rng() * Math.PI * 2;
  const distance = INNER_CLEAR_RADIUS + rng() * (OUTER_RADIUS - INNER_CLEAR_RADIUS);
  return { x: Math.cos(angle) * distance, z: Math.sin(angle) * distance };
}

export function pearlAllowed(): boolean {
  return true;
}
