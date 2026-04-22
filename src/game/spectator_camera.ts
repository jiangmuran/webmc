// Spectator camera modes. Free-fly (default), third-person-back,
// third-person-front, and "view entity" which follows an entity's eye.

export type CameraMode =
  | 'first_person'
  | 'third_back'
  | 'third_front'
  | 'spectator_free'
  | 'spectator_entity';

export interface Camera {
  mode: CameraMode;
  followEntityId: string | null;
  offsetBack: number;
}

export function makeCamera(): Camera {
  return { mode: 'first_person', followEntityId: null, offsetBack: 4 };
}

export function cycleCamera(c: Camera): void {
  const order: CameraMode[] = ['first_person', 'third_back', 'third_front'];
  const idx = order.indexOf(c.mode);
  if (idx === -1) {
    c.mode = 'first_person';
  } else {
    c.mode = order[(idx + 1) % order.length] ?? 'first_person';
  }
}

export function viewEntity(c: Camera, entityId: string): void {
  c.mode = 'spectator_entity';
  c.followEntityId = entityId;
}

export function stopViewing(c: Camera): void {
  c.mode = 'spectator_free';
  c.followEntityId = null;
}

// Spectators never collide or take damage.
export function isNoclip(mode: CameraMode): boolean {
  return mode === 'spectator_free' || mode === 'spectator_entity';
}
