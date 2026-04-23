export interface VibrationEvent {
  id: string;
  sourceX: number;
  sourceY: number;
  sourceZ: number;
  time: number;
}

export const DEFAULT_RANGE = 16;

export function delayTicksBetween(dx: number, dy: number, dz: number): number {
  const dist = Math.hypot(dx, dy, dz);
  return Math.ceil(dist);
}

export function inRange(
  event: VibrationEvent,
  observerX: number,
  observerY: number,
  observerZ: number,
  range = DEFAULT_RANGE,
): boolean {
  const d = Math.hypot(
    event.sourceX - observerX,
    event.sourceY - observerY,
    event.sourceZ - observerZ,
  );
  return d <= range;
}

export function isOccludedBy(blockBetween: string): boolean {
  return blockBetween === 'wool';
}
