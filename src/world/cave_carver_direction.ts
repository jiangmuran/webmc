// Cave carver. A random 3D walk from a start point, carving spheres
// of varying radius, occasionally branching. Deterministic for a seed.

export interface CarverQuery {
  rand: () => number;
  startX: number;
  startY: number;
  startZ: number;
  maxLength: number;
}

export interface CarverStep {
  x: number;
  y: number;
  z: number;
  radius: number;
}

export function runCarver(q: CarverQuery): CarverStep[] {
  const steps: CarverStep[] = [];
  let yaw = q.rand() * Math.PI * 2;
  let pitch = (q.rand() - 0.5) * 0.5; // mostly horizontal
  let x = q.startX;
  let y = q.startY;
  let z = q.startZ;
  for (let i = 0; i < q.maxLength; i++) {
    yaw += (q.rand() - 0.5) * 0.4;
    pitch += (q.rand() - 0.5) * 0.1;
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
    x += Math.cos(yaw) * Math.cos(pitch);
    y += Math.sin(pitch);
    z += Math.sin(yaw) * Math.cos(pitch);
    const radius = 2 + q.rand() * 2;
    steps.push({ x, y, z, radius });
  }
  return steps;
}

// Branch chance at each step.
export const BRANCH_CHANCE = 0.01;

export function shouldBranch(rand: () => number): boolean {
  return rand() < BRANCH_CHANCE;
}
