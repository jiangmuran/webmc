// Minecarts can be coupled by proximity (furnace cart pushes regular).
// Simple approximation: if carts are adjacent on same line, their
// velocities blend toward the average.

export interface Cart {
  id: string;
  x: number;
  z: number;
  vx: number;
  vz: number;
}

export function attemptCouple(a: Cart, b: Cart, maxDistance = 1.5): boolean {
  const d = Math.hypot(a.x - b.x, a.z - b.z);
  return d <= maxDistance;
}

export function blendVelocities(a: Cart, b: Cart, weight = 0.5): { a: Cart; b: Cart } {
  const avx = a.vx * (1 - weight) + b.vx * weight;
  const avz = a.vz * (1 - weight) + b.vz * weight;
  const bvx = b.vx * (1 - weight) + a.vx * weight;
  const bvz = b.vz * (1 - weight) + a.vz * weight;
  return { a: { ...a, vx: avx, vz: avz }, b: { ...b, vx: bvx, vz: bvz } };
}

export function repelOverlap(a: Cart, b: Cart): { a: Cart; b: Cart } {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  const dist = Math.hypot(dx, dz) || 1;
  const push = 0.1;
  const nx = (dx / dist) * push;
  const nz = (dz / dist) * push;
  return { a: { ...a, vx: a.vx + nx, vz: a.vz + nz }, b: { ...b, vx: b.vx - nx, vz: b.vz - nz } };
}
