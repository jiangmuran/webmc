// First-person / third-person camera switching. F5 cycles through
// FIRST, THIRD_BACK, THIRD_FRONT. In third-person, the camera sits a
// fixed distance behind/in-front-of the player and collides with blocks.

export type CameraPerspective = 'first' | 'third_back' | 'third_front';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface CameraState {
  perspective: CameraPerspective;
  thirdPersonDistance: number;
}

export function makeCamera(): CameraState {
  return { perspective: 'first', thirdPersonDistance: 4 };
}

const CYCLE_ORDER: readonly CameraPerspective[] = ['first', 'third_back', 'third_front'];

export function cyclePerspective(state: CameraState): CameraPerspective {
  const idx = CYCLE_ORDER.indexOf(state.perspective);
  const next = CYCLE_ORDER[(idx + 1) % CYCLE_ORDER.length];
  if (next) state.perspective = next;
  return state.perspective;
}

export interface CameraQuery {
  state: CameraState;
  playerPos: Vec3;
  playerEyeHeight: number;
  yawRad: number;
  pitchRad: number;
  isBlocked: (from: Vec3, to: Vec3) => boolean;
}

export interface CameraResult {
  position: Vec3;
  forward: Vec3;
  firstPerson: boolean;
}

export function computeCameraPose(q: CameraQuery): CameraResult {
  const eye: Vec3 = {
    x: q.playerPos.x,
    y: q.playerPos.y + q.playerEyeHeight,
    z: q.playerPos.z,
  };
  const sinP = Math.sin(q.pitchRad);
  const cosP = Math.cos(q.pitchRad);
  const sinY = Math.sin(q.yawRad);
  const cosY = Math.cos(q.yawRad);
  const forward: Vec3 = {
    x: -sinY * cosP,
    y: -sinP,
    z: cosY * cosP,
  };
  if (q.state.perspective === 'first') {
    return { position: eye, forward, firstPerson: true };
  }
  const sign = q.state.perspective === 'third_back' ? -1 : 1;
  const desired: Vec3 = {
    x: eye.x + forward.x * q.state.thirdPersonDistance * sign,
    y: eye.y + forward.y * q.state.thirdPersonDistance * sign,
    z: eye.z + forward.z * q.state.thirdPersonDistance * sign,
  };
  // Collision pull-back: if blocked, pull camera to eye + 90% of direction.
  let final = desired;
  if (q.isBlocked(eye, desired)) {
    const factor = 0.5;
    final = {
      x: eye.x + (desired.x - eye.x) * factor,
      y: eye.y + (desired.y - eye.y) * factor,
      z: eye.z + (desired.z - eye.z) * factor,
    };
  }
  // Third-person front looks back at player, so flip forward.
  const outForward =
    q.state.perspective === 'third_front'
      ? { x: -forward.x, y: -forward.y, z: -forward.z }
      : forward;
  return { position: final, forward: outForward, firstPerson: false };
}
