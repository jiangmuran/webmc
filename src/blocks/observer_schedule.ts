export const OUTPUT_DURATION_TICKS = 2;

export interface Observer {
  lastChangeTick: number;
  outputUntilTick: number;
}

export function onBlockUpdate(nowTick: number): Observer {
  return { lastChangeTick: nowTick, outputUntilTick: nowTick + OUTPUT_DURATION_TICKS };
}

export function isPowered(o: Observer, nowTick: number): boolean {
  return nowTick < o.outputUntilTick;
}

export function outputSignal(o: Observer, nowTick: number): number {
  return isPowered(o, nowTick) ? 15 : 0;
}
