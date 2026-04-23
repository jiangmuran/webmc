export interface TurtleBaby {
  ageTicks: number;
}

export const GROWN_TICKS = 24000;

export function isGrownUp(t: TurtleBaby): boolean {
  return t.ageTicks >= GROWN_TICKS;
}

export function scutesDroppedOnGrow(t: TurtleBaby): number {
  return isGrownUp(t) ? 1 : 0;
}
