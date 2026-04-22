// Lodestone compass. Right-clicking a compass on a lodestone binds it to
// that position (dimension-aware). A bound compass always points at the
// lodestone; if the lodestone is destroyed, the compass spins randomly.

import type { Enchanted } from './enchantment';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface LodestoneBinding {
  pos: Vec3;
  dimension: string;
  destroyed: boolean;
}

// Compass stack with binding metadata.
export interface BoundCompass extends Enchanted {
  binding?: LodestoneBinding;
}

export function bindCompass(compass: Enchanted, pos: Vec3, dimension: string): BoundCompass {
  return { ...compass, binding: { pos, dimension, destroyed: false } };
}

export function unbindCompass(compass: BoundCompass): Enchanted {
  const { binding: _binding, ...rest } = compass;
  void _binding;
  return rest;
}

// Point toward the binding if still valid + same dimension; null otherwise.
export function compassTargetFor(compass: BoundCompass, currentDimension: string): Vec3 | null {
  if (!compass.binding) return null;
  if (compass.binding.destroyed) return null;
  if (compass.binding.dimension !== currentDimension) return null;
  return compass.binding.pos;
}

// Called when a lodestone block at `pos` is broken; invalidates matching
// compass bindings (the caller iterates held compasses + chest contents).
export function invalidateBinding(compass: BoundCompass, brokenPos: Vec3, dimension: string): void {
  if (!compass.binding) return;
  if (compass.binding.dimension !== dimension) return;
  if (
    compass.binding.pos.x === brokenPos.x &&
    compass.binding.pos.y === brokenPos.y &&
    compass.binding.pos.z === brokenPos.z
  ) {
    compass.binding.destroyed = true;
  }
}
