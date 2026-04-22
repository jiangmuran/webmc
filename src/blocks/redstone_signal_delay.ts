// Repeater delay. 1..4 ticks (2..8 game ticks). Right-click cycles
// delay. Repeater also locks when powered on the side by another
// repeater (see repeater_lock module); this file models only the
// delay scheduling.

export interface Repeater {
  delayTicks: 1 | 2 | 3 | 4;
  scheduledToggleAtTick: number | null;
  outputPowered: boolean;
}

export function makeRepeater(delay: 1 | 2 | 3 | 4 = 1): Repeater {
  return { delayTicks: delay, scheduledToggleAtTick: null, outputPowered: false };
}

export function cycleDelay(r: Repeater): void {
  r.delayTicks = (r.delayTicks === 4 ? 1 : r.delayTicks + 1) as 1 | 2 | 3 | 4;
}

export interface InputChange {
  nowTick: number;
  newInputPowered: boolean;
}

// When input changes, schedule a toggle after delayTicks*2 (game ticks).
export function onInputChange(r: Repeater, q: InputChange): void {
  const targetTick = q.nowTick + r.delayTicks * 2;
  if (q.newInputPowered !== r.outputPowered) {
    r.scheduledToggleAtTick = targetTick;
  } else {
    r.scheduledToggleAtTick = null;
  }
}

// Tick resolver: if scheduled and time reached, toggle output.
export function tickRepeater(r: Repeater, nowTick: number): boolean {
  if (r.scheduledToggleAtTick === null) return false;
  if (nowTick < r.scheduledToggleAtTick) return false;
  r.outputPowered = !r.outputPowered;
  r.scheduledToggleAtTick = null;
  return true;
}
