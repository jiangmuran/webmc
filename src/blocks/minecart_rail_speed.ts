// Minecart + rail speeds. Normal rail = 0.4 b/t max. Powered rail +
// power = boost, no power = brake. Detector rail emits redstone when
// minecart on top. Activator rail triggers TNT minecart / hopper.

export type RailKind = 'normal' | 'powered' | 'detector' | 'activator';

export const MINECART_MAX_SPEED = 0.4;
export const POWERED_BOOST = 0.06;
export const POWERED_BRAKE = 0.9;

export interface RailSegment {
  kind: RailKind;
  powered: boolean;
}

export interface MinecartStepQuery {
  velocity: number;
  railBelow: RailSegment;
  occupied: boolean; // has a passenger
}

export function stepVelocity(q: MinecartStepQuery): number {
  let v = q.velocity;
  if (q.railBelow.kind === 'powered') {
    if (q.railBelow.powered) {
      v += POWERED_BOOST;
    } else {
      v *= POWERED_BRAKE;
    }
  }
  // Carts slow on ascents / speed on descents are not modeled here.
  if (!q.occupied) v *= 0.97; // friction
  return Math.max(0, Math.min(MINECART_MAX_SPEED, v));
}

// Detector rail emits signal while a cart is on top.
export function detectorSignal(cartOn: boolean): number {
  return cartOn ? 15 : 0;
}

// Activator rail triggers TNT minecart (ignites) / hopper minecart
// (disables pickup).
export function activatorEffect(cartKind: string): 'ignite' | 'disable_pickup' | null {
  if (cartKind === 'tnt_minecart') return 'ignite';
  if (cartKind === 'hopper_minecart') return 'disable_pickup';
  return null;
}
