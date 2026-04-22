// Glow lichen. Attaches to any full face; 6-direction placement flags.
// Emits light 7. Bone-mealed, spreads to adjacent stone-like surfaces.

export type Face = 'up' | 'down' | 'north' | 'south' | 'east' | 'west';

export interface GlowLichenState {
  attachedFaces: Set<Face>;
}

export function makeGlowLichen(initial: Face): GlowLichenState {
  return { attachedFaces: new Set([initial]) };
}

export function addFace(state: GlowLichenState, face: Face): boolean {
  if (state.attachedFaces.has(face)) return false;
  state.attachedFaces.add(face);
  return true;
}

export function lightEmission(): number {
  return 7;
}

// Bone meal spreads lichen to adjacent attachable faces.
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface LichenLookup {
  hasSolidFace(x: number, y: number, z: number, face: Face): boolean;
}

export interface SpreadPlacement {
  pos: Vec3;
  face: Face;
}

const FACE_OFFSETS: Record<Face, Vec3> = {
  up: { x: 0, y: 1, z: 0 },
  down: { x: 0, y: -1, z: 0 },
  north: { x: 0, y: 0, z: -1 },
  south: { x: 0, y: 0, z: 1 },
  east: { x: 1, y: 0, z: 0 },
  west: { x: -1, y: 0, z: 0 },
};

export function boneMealSpread(
  origin: Vec3,
  lookup: LichenLookup,
  rng: () => number = Math.random,
): readonly SpreadPlacement[] {
  const placements: SpreadPlacement[] = [];
  for (const face of Object.keys(FACE_OFFSETS) as Face[]) {
    const off = FACE_OFFSETS[face];
    const target = { x: origin.x + off.x, y: origin.y + off.y, z: origin.z + off.z };
    if (!lookup.hasSolidFace(target.x, target.y, target.z, face)) continue;
    if (rng() < 0.5) placements.push({ pos: target, face });
  }
  return placements;
}
