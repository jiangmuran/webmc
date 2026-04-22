// World border. Square region around (0,0) with size. Outside the
// border player takes damage. Can animate shrink/expand over a
// duration.

export interface WorldBorder {
  centerX: number;
  centerZ: number;
  currentSize: number;
  targetSize: number;
  interpStartMs: number;
  interpDurationMs: number;
  damageBuffer: number;
  damagePerBlockOutside: number;
}

export function makeBorder(size = 60_000_000): WorldBorder {
  return {
    centerX: 0,
    centerZ: 0,
    currentSize: size,
    targetSize: size,
    interpStartMs: 0,
    interpDurationMs: 0,
    damageBuffer: 5,
    damagePerBlockOutside: 0.2,
  };
}

export function setSize(b: WorldBorder, size: number, overMs: number, nowMs: number): void {
  b.currentSize = effectiveSize(b, nowMs);
  b.targetSize = size;
  b.interpStartMs = nowMs;
  b.interpDurationMs = overMs;
}

export function effectiveSize(b: WorldBorder, nowMs: number): number {
  if (b.interpDurationMs <= 0) return b.targetSize;
  const f = Math.min(1, Math.max(0, (nowMs - b.interpStartMs) / b.interpDurationMs));
  return b.currentSize + (b.targetSize - b.currentSize) * f;
}

export function isOutside(b: WorldBorder, x: number, z: number, nowMs: number): boolean {
  const half = effectiveSize(b, nowMs) / 2;
  return Math.abs(x - b.centerX) > half || Math.abs(z - b.centerZ) > half;
}

export function damagePerSecondOutside(
  b: WorldBorder,
  x: number,
  z: number,
  nowMs: number,
): number {
  if (!isOutside(b, x, z, nowMs)) return 0;
  const half = effectiveSize(b, nowMs) / 2;
  const overX = Math.max(0, Math.abs(x - b.centerX) - half);
  const overZ = Math.max(0, Math.abs(z - b.centerZ) - half);
  const over = Math.max(overX, overZ);
  const past = Math.max(0, over - b.damageBuffer);
  return past * b.damagePerBlockOutside;
}
