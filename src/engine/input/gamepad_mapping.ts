// Gamepad axis/button mapping (Xbox-style layout).

export interface GamepadState {
  axes: [number, number, number, number]; // LX LY RX RY
  buttons: boolean[];
}

export const AXIS_DEADZONE = 0.15;

export function applyDeadzone(v: number): number {
  if (Math.abs(v) < AXIS_DEADZONE) return 0;
  const sign = Math.sign(v);
  return (sign * (Math.abs(v) - AXIS_DEADZONE)) / (1 - AXIS_DEADZONE);
}

export interface MovementIntent {
  forward: number;
  strafe: number;
  look: { yaw: number; pitch: number };
  jump: boolean;
  sneak: boolean;
  attack: boolean;
  use: boolean;
}

export function toIntent(g: GamepadState): MovementIntent {
  return {
    forward: -applyDeadzone(g.axes[1]),
    strafe: applyDeadzone(g.axes[0]),
    look: { yaw: applyDeadzone(g.axes[2]), pitch: applyDeadzone(g.axes[3]) },
    jump: g.buttons[0] ?? false, // A
    sneak: g.buttons[10] ?? false, // L3
    attack: g.buttons[7] ?? false, // RT
    use: g.buttons[6] ?? false, // LT
  };
}

// In-place variant for the per-frame poller. Same mapping as toIntent
// but mutates the caller-provided result + nested look object so a
// 60 Hz gamepad poll doesn't allocate two objects per frame.
export function toIntentInto(g: GamepadState, out: MovementIntent): void {
  out.forward = -applyDeadzone(g.axes[1]);
  out.strafe = applyDeadzone(g.axes[0]);
  out.look.yaw = applyDeadzone(g.axes[2]);
  out.look.pitch = applyDeadzone(g.axes[3]);
  out.jump = g.buttons[0] ?? false;
  out.sneak = g.buttons[10] ?? false;
  out.attack = g.buttons[7] ?? false;
  out.use = g.buttons[6] ?? false;
}
