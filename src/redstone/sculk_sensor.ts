// Sculk sensor — emits a redstone signal when a "vibration" event happens
// within 8 blocks. Vibrations are weighted by event kind (1 = step on
// grass, 15 = explosion). On activation the sensor holds its level for 40
// ticks + cooldown.

export type VibrationKind =
  | 'step'
  | 'landing'
  | 'break_block'
  | 'place_block'
  | 'swim'
  | 'jump'
  | 'throw'
  | 'splash'
  | 'explode'
  | 'shoot'
  | 'close_door'
  | 'open_door'
  | 'equip'
  | 'drop'
  | 'eat';

const VIBRATION_FREQUENCY: Record<VibrationKind, number> = {
  step: 1,
  swim: 1,
  landing: 2,
  jump: 2,
  splash: 3,
  shoot: 3,
  throw: 3,
  drop: 3,
  eat: 4,
  equip: 4,
  close_door: 5,
  open_door: 5,
  break_block: 5,
  place_block: 6,
  explode: 15,
};

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SculkSensorState {
  pos: Vec3;
  output: number;
  cooldownSec: number;
  activeSec: number;
}

const SENSE_RADIUS = 8;
const COOLDOWN_SEC = 1;
const ACTIVE_SEC = 2;

export function makeSculkSensor(pos: Vec3): SculkSensorState {
  return { pos, output: 0, cooldownSec: 0, activeSec: 0 };
}

// Emit a single vibration near the sensor. If within range and the sensor
// is not cooling down, activates with a signal scaled by frequency +
// distance.
export function emitVibration(sensor: SculkSensorState, kind: VibrationKind, at: Vec3): boolean {
  if (sensor.cooldownSec > 0) return false;
  const dx = at.x - sensor.pos.x;
  const dy = at.y - sensor.pos.y;
  const dz = at.z - sensor.pos.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist > SENSE_RADIUS) return false;
  // Signal strength: freq - floor(dist) clamped to 1..15.
  const freq = VIBRATION_FREQUENCY[kind];
  const signal = Math.max(1, Math.min(15, freq + Math.max(0, 8 - Math.floor(dist))));
  sensor.output = signal;
  sensor.activeSec = ACTIVE_SEC;
  return true;
}

export function tickSculkSensor(sensor: SculkSensorState, dtSec: number): void {
  if (sensor.cooldownSec > 0) {
    sensor.cooldownSec = Math.max(0, sensor.cooldownSec - dtSec);
  }
  if (sensor.activeSec > 0) {
    sensor.activeSec = Math.max(0, sensor.activeSec - dtSec);
    if (sensor.activeSec === 0) {
      sensor.output = 0;
      sensor.cooldownSec = COOLDOWN_SEC;
    }
  }
}
