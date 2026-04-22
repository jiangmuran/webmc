// /time command. Supports set/add with numeric ticks or named times
// (day, night, noon, midnight).

const NAMED_TIMES: Record<string, number> = {
  day: 1000,
  noon: 6000,
  night: 13000,
  midnight: 18000,
  sunrise: 23000,
  sunset: 12000,
};

export type TimeCmd =
  | { op: 'set'; value: number | string }
  | { op: 'add'; value: number }
  | { op: 'query' };

export interface WorldTime {
  worldTick: number;
}

export function applyTime(w: WorldTime, cmd: TimeCmd): number {
  if (cmd.op === 'query') return w.worldTick % 24000;
  if (cmd.op === 'add') {
    w.worldTick = (w.worldTick + Math.max(0, cmd.value)) % Number.MAX_SAFE_INTEGER;
    return w.worldTick % 24000;
  }
  // set
  let target: number;
  if (typeof cmd.value === 'number') target = cmd.value;
  else target = NAMED_TIMES[cmd.value] ?? 0;
  const curDay = Math.floor(w.worldTick / 24000);
  w.worldTick = curDay * 24000 + (target % 24000);
  return w.worldTick % 24000;
}
