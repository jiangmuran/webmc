// Redstone repeater. 4 delay settings (1..4 ticks). Acts as a diode:
// only accepts input from back; emits 15 forward for delay ticks after.

export interface Repeater {
  delaySetting: 1 | 2 | 3 | 4; // ticks
  facing: 'north' | 'south' | 'east' | 'west';
  locked: boolean;
  poweredFor: number; // pending ticks until power turns off
}

export function onPoweredInput(r: Repeater): Repeater {
  if (r.locked) return r;
  return { ...r, poweredFor: r.delaySetting };
}

export function tick(r: Repeater): Repeater {
  if (r.poweredFor <= 0) return r;
  return { ...r, poweredFor: r.poweredFor - 1 };
}

export function outputPower(r: Repeater): number {
  return r.poweredFor > 0 ? 15 : 0;
}

export function lockByPerpendicularRepeater(r: Repeater, perpendicularPowered: boolean): Repeater {
  return { ...r, locked: perpendicularPowered };
}

export function nextDelay(r: Repeater): Repeater {
  const next = (r.delaySetting % 4) + 1;
  return { ...r, delaySetting: next as 1 | 2 | 3 | 4 };
}
