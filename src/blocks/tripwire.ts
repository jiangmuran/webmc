// Tripwire + tripwire hook. Two hooks strung with string form a tripwire
// line; stepping on any segment activates both hooks. Cutting the wire
// with shears disarms it without triggering.

export interface TripwireHook {
  facing: 'north' | 'south' | 'east' | 'west';
  attached: boolean;
  powered: boolean;
}

export function makeHook(facing: TripwireHook['facing']): TripwireHook {
  return { facing, attached: false, powered: false };
}

// A line is valid if two hooks face each other along a straight cardinal
// direction with 2..40 string blocks between them.
export interface TripwireLine {
  hookA: { pos: { x: number; y: number; z: number }; facing: TripwireHook['facing'] };
  hookB: { pos: { x: number; y: number; z: number }; facing: TripwireHook['facing'] };
  stringLen: number;
  entityOnWire: boolean;
}

const MAX_STRING = 40;

export function validLineBetween(a: TripwireLine['hookA'], b: TripwireLine['hookB']): boolean {
  const opposite =
    (a.facing === 'north' && b.facing === 'south') ||
    (a.facing === 'south' && b.facing === 'north') ||
    (a.facing === 'east' && b.facing === 'west') ||
    (a.facing === 'west' && b.facing === 'east');
  if (!opposite) return false;
  const dx = Math.abs(b.pos.x - a.pos.x);
  const dy = Math.abs(b.pos.y - a.pos.y);
  const dz = Math.abs(b.pos.z - a.pos.z);
  if (dy !== 0) return false;
  if (a.facing === 'north' || a.facing === 'south') {
    if (dx !== 0) return false;
    return dz >= 2 && dz <= MAX_STRING;
  }
  if (dz !== 0) return false;
  return dx >= 2 && dx <= MAX_STRING;
}

// Activation: stepping on ANY string block activates both hooks with
// power 15; leaving the wire drops power to 0.
export function activateLine(
  line: TripwireLine,
  entityOn: boolean,
): {
  hookAPowered: boolean;
  hookBPowered: boolean;
} {
  line.entityOnWire = entityOn;
  return { hookAPowered: entityOn, hookBPowered: entityOn };
}

// Cutting with shears: remove the string but do not activate hooks.
export interface CutResult {
  triggered: boolean;
  droppedString: number;
}

export function cutTripwire(line: TripwireLine, withShears: boolean): CutResult {
  if (!withShears) {
    // breaking string by hand still triggers the hooks.
    return { triggered: true, droppedString: 0 };
  }
  return { triggered: false, droppedString: line.stringLen };
}
