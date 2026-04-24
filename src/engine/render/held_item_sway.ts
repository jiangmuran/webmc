export interface SwayInput {
  walkSpeed: number;
  ticks: number;
  sprinting: boolean;
}

export function swayOffset(i: SwayInput): { dx: number; dy: number } {
  const frequency = i.sprinting ? 10 : 6;
  const amplitude = Math.min(0.05, i.walkSpeed * 0.1);
  return {
    dx: Math.cos(i.ticks / frequency) * amplitude,
    dy: Math.abs(Math.sin(i.ticks / frequency)) * amplitude,
  };
}

export function equipAnimationOffset(equipProgress01: number): { dy: number; rotate: number } {
  return {
    dy: -0.5 * (1 - equipProgress01),
    rotate: (1 - equipProgress01) * Math.PI * 0.25,
  };
}
