// Tripwire + hook. Two hooks face each other; a string line connects
// them (up to 40 blocks). Any entity crossing the tripwire powers both
// hooks with signal 15.

export interface TripwireSetup {
  hookAFaces: 'north' | 'south' | 'east' | 'west';
  hookBFaces: 'north' | 'south' | 'east' | 'west';
  distance: number;
  stringBreakCount: number; // # of string blocks removed
}

export const MAX_TRIPWIRE_LENGTH = 40;

export function isValidSetup(s: TripwireSetup): boolean {
  if (s.distance <= 0 || s.distance > MAX_TRIPWIRE_LENGTH) return false;
  const axisA = s.hookAFaces === 'north' || s.hookAFaces === 'south' ? 'z' : 'x';
  const axisB = s.hookBFaces === 'north' || s.hookBFaces === 'south' ? 'z' : 'x';
  if (axisA !== axisB) return false;
  // must face each other
  const opposite: Record<string, string> = {
    north: 'south',
    south: 'north',
    east: 'west',
    west: 'east',
  };
  if (opposite[s.hookAFaces] !== s.hookBFaces) return false;
  return true;
}

export interface PowerQuery {
  entityOnTripwire: boolean;
  stringIntact: boolean;
}

export function hookPower(q: PowerQuery): number {
  if (!q.stringIntact) return 0;
  return q.entityOnTripwire ? 15 : 0;
}

// Breaking tripwire with shears (no-propagation) vs. breaking with
// anything else (triggers a pulse as the string falls).
export function breakTripwire(withShears: boolean): 'drop_string' | 'drop_string_trigger' {
  return withShears ? 'drop_string' : 'drop_string_trigger';
}
