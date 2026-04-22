// Entity snapshot delta encoding. Sent at 30 Hz for position/velocity/yaw
// of remote entities. Deltas are built against the last acknowledged
// snapshot; if an ack is missing for too long, the sender falls back to
// a full snapshot.

export interface EntitySnapshot {
  id: number;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  vx: number;
  vy: number;
  vz: number;
}

export interface EntityDelta {
  id: number;
  // 8-bit field mask: bits for dx, dy, dz, dYaw, dPitch, dVx, dVy, dVz.
  mask: number;
  dx?: number;
  dy?: number;
  dz?: number;
  dYaw?: number;
  dPitch?: number;
  dVx?: number;
  dVy?: number;
  dVz?: number;
}

const DX = 1 << 0;
const DY = 1 << 1;
const DZ = 1 << 2;
const DYAW = 1 << 3;
const DPITCH = 1 << 4;
const DVX = 1 << 5;
const DVY = 1 << 6;
const DVZ = 1 << 7;

const EPS = 1e-4;

export function diffSnapshot(prev: EntitySnapshot, next: EntitySnapshot): EntityDelta | null {
  if (prev.id !== next.id) throw new Error('id mismatch');
  let mask = 0;
  const out: EntityDelta = { id: next.id, mask: 0 };
  if (Math.abs(next.x - prev.x) > EPS) {
    out.dx = next.x - prev.x;
    mask |= DX;
  }
  if (Math.abs(next.y - prev.y) > EPS) {
    out.dy = next.y - prev.y;
    mask |= DY;
  }
  if (Math.abs(next.z - prev.z) > EPS) {
    out.dz = next.z - prev.z;
    mask |= DZ;
  }
  if (Math.abs(next.yaw - prev.yaw) > EPS) {
    out.dYaw = next.yaw - prev.yaw;
    mask |= DYAW;
  }
  if (Math.abs(next.pitch - prev.pitch) > EPS) {
    out.dPitch = next.pitch - prev.pitch;
    mask |= DPITCH;
  }
  if (Math.abs(next.vx - prev.vx) > EPS) {
    out.dVx = next.vx - prev.vx;
    mask |= DVX;
  }
  if (Math.abs(next.vy - prev.vy) > EPS) {
    out.dVy = next.vy - prev.vy;
    mask |= DVY;
  }
  if (Math.abs(next.vz - prev.vz) > EPS) {
    out.dVz = next.vz - prev.vz;
    mask |= DVZ;
  }
  out.mask = mask;
  if (mask === 0) return null;
  return out;
}

export function applyDelta(base: EntitySnapshot, delta: EntityDelta): EntitySnapshot {
  const out = { ...base };
  if (delta.mask & DX) out.x += delta.dx ?? 0;
  if (delta.mask & DY) out.y += delta.dy ?? 0;
  if (delta.mask & DZ) out.z += delta.dz ?? 0;
  if (delta.mask & DYAW) out.yaw += delta.dYaw ?? 0;
  if (delta.mask & DPITCH) out.pitch += delta.dPitch ?? 0;
  if (delta.mask & DVX) out.vx += delta.dVx ?? 0;
  if (delta.mask & DVY) out.vy += delta.dVy ?? 0;
  if (delta.mask & DVZ) out.vz += delta.dVz ?? 0;
  return out;
}

// Byte-size estimator: 4 bytes id + 1 byte mask + 2 bytes per set field
// (quantized to 0.01 precision, -327.68..327.68).
export function deltaByteSize(delta: EntityDelta): number {
  let m = delta.mask;
  let bitsSet = 0;
  while (m !== 0) {
    bitsSet += m & 1;
    m >>>= 1;
  }
  return 5 + bitsSet * 2;
}
