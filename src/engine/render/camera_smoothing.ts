// Smooth camera setting: lerps yaw+pitch toward target. Off by default.

export interface CameraSmooth {
  yaw: number;
  pitch: number;
  yawTarget: number;
  pitchTarget: number;
  smoothing: number; // 0..1
}

export function updateInput(c: CameraSmooth, dyawDeg: number, dpitchDeg: number): CameraSmooth {
  const nyaw = c.yawTarget + dyawDeg;
  const npitch = Math.max(-90, Math.min(90, c.pitchTarget + dpitchDeg));
  return { ...c, yawTarget: nyaw, pitchTarget: npitch };
}

export function tick(c: CameraSmooth): CameraSmooth {
  if (c.smoothing <= 0) return { ...c, yaw: c.yawTarget, pitch: c.pitchTarget };
  const lerp = 1 - c.smoothing;
  return {
    ...c,
    yaw: c.yaw + (c.yawTarget - c.yaw) * lerp,
    pitch: c.pitch + (c.pitchTarget - c.pitch) * lerp,
  };
}

export function initCam(): CameraSmooth {
  return { yaw: 0, pitch: 0, yawTarget: 0, pitchTarget: 0, smoothing: 0 };
}
