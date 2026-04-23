// Memory pressure monitor. Uses performance.memory where available.
// Drives chunk unload priority.

export interface MemoryReading {
  heapUsed: number;
  heapLimit: number;
}

export type PressureLevel = 'normal' | 'elevated' | 'critical';

export function pressureLevel(m: MemoryReading): PressureLevel {
  const ratio = m.heapUsed / m.heapLimit;
  if (ratio > 0.9) return 'critical';
  if (ratio > 0.75) return 'elevated';
  return 'normal';
}

export function targetCachedChunks(p: PressureLevel, maxCapacity: number): number {
  if (p === 'critical') return Math.floor(maxCapacity * 0.25);
  if (p === 'elevated') return Math.floor(maxCapacity * 0.5);
  return maxCapacity;
}

export function shouldForceGc(p: PressureLevel): boolean {
  return p === 'critical';
}
