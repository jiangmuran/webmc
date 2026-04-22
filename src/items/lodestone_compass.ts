// Lodestone compass: compass use on a lodestone binds it to that
// position + dimension. Points to lodestone in any dimension; spins
// if lodestone is destroyed or dimension differs with no lodestone.

export interface LodestoneBinding {
  x: number;
  y: number;
  z: number;
  dimension: string;
}

export interface CompassState {
  binding: LodestoneBinding | null;
  lodestoneExists: boolean;
}

export type CompassResult = { kind: 'points'; dx: number; dz: number } | { kind: 'spins' };

export function pointerDirection(
  s: CompassState,
  here: { x: number; z: number; dimension: string },
): CompassResult {
  if (!s.binding || !s.lodestoneExists) return { kind: 'spins' };
  if (s.binding.dimension !== here.dimension) return { kind: 'spins' };
  return { kind: 'points', dx: s.binding.x - here.x, dz: s.binding.z - here.z };
}

export function bindTo(b: LodestoneBinding): CompassState {
  return { binding: b, lodestoneExists: true };
}
