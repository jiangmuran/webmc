// Ocean currents. Bubble columns rising from soul sand push entities up;
// magma blocks pull entities down. Kelp/water flow pushes in flow direction.
// This module exposes the velocity impulse an entity should receive at a
// given position.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface CurrentLookup {
  isSoulSandBelow: (x: number, y: number, z: number) => boolean;
  isMagmaBelow: (x: number, y: number, z: number) => boolean;
  waterFlowDir: (x: number, y: number, z: number) => Vec3; // unit vec or zero
}

export interface CurrentQuery {
  pos: Vec3;
  inWater: boolean;
  lookup: CurrentLookup;
}

const BUBBLE_UP_SPEED = 1.8;
const MAGMA_PULL_SPEED = -0.5;
const FLOW_PUSH_SPEED = 0.7;

export function currentImpulseAt(q: CurrentQuery): Vec3 {
  if (!q.inWater) return { x: 0, y: 0, z: 0 };
  const { x, y, z } = q.pos;
  const bx = Math.floor(x),
    by = Math.floor(y),
    bz = Math.floor(z);
  const imp: Vec3 = { x: 0, y: 0, z: 0 };
  if (q.lookup.isSoulSandBelow(bx, by, bz)) imp.y += BUBBLE_UP_SPEED;
  if (q.lookup.isMagmaBelow(bx, by, bz)) imp.y += MAGMA_PULL_SPEED;
  const flow = q.lookup.waterFlowDir(bx, by, bz);
  imp.x += flow.x * FLOW_PUSH_SPEED;
  imp.y += flow.y * FLOW_PUSH_SPEED;
  imp.z += flow.z * FLOW_PUSH_SPEED;
  return imp;
}

// Items (dropped item entities) get the same treatment, but with 10x
// lower magnitude so they don't rocket through the water column.
export function itemCurrentImpulse(q: CurrentQuery): Vec3 {
  const b = currentImpulseAt(q);
  return { x: b.x * 0.1, y: b.y * 0.1, z: b.z * 0.1 };
}
