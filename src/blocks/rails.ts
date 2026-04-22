// Powered rail / detector rail / activator rail. All share the same
// kinematics as plain rail but emit redstone / power the cart differently.

export type RailKindExt = 'rail' | 'powered_rail' | 'detector_rail' | 'activator_rail';

export interface PoweredRailQuery {
  hasPower: boolean;
  hasCartOnTop: boolean;
}

export interface PoweredRailResult {
  accelerate: boolean;
  brakes: boolean;
}

// Powered rail accelerates with adjacent redstone power; otherwise brakes.
export function poweredRailEffect(q: PoweredRailQuery): PoweredRailResult {
  if (!q.hasCartOnTop) return { accelerate: false, brakes: false };
  return { accelerate: q.hasPower, brakes: !q.hasPower };
}

// Detector rail: outputs redstone = 15 while any cart sits on top.
export function detectorRailSignal(hasCartOnTop: boolean): number {
  return hasCartOnTop ? 15 : 0;
}

// Activator rail: pulses "activate" on cart passage when powered. For
// TNT minecarts this primes the fuse; for hopper minecarts it disables
// pickup; for chest/furnace just ejects the rider.
export interface ActivatorQuery {
  hasPower: boolean;
  cartVariant: 'plain' | 'chest' | 'hopper' | 'furnace' | 'tnt' | 'command';
}

export interface ActivatorEffect {
  ejectRider: boolean;
  primeTnt: boolean;
  disableHopper: boolean;
}

export function activatorRailEffect(q: ActivatorQuery): ActivatorEffect {
  if (!q.hasPower) {
    return { ejectRider: false, primeTnt: false, disableHopper: false };
  }
  return {
    ejectRider: true,
    primeTnt: q.cartVariant === 'tnt',
    disableHopper: q.cartVariant === 'hopper',
  };
}
