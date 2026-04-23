// Lingering potion cloud. Stays 30s by default; shrinks over time.

export interface LingeringCloud {
  radius: number;
  maxRadius: number;
  ticksRemaining: number;
  perTickRadiusDelta: number;
}

export function spawn(radius = 3, durationTicks = 600): LingeringCloud {
  return {
    radius,
    maxRadius: radius,
    ticksRemaining: durationTicks,
    perTickRadiusDelta: -radius / durationTicks,
  };
}

export function tick(c: LingeringCloud): LingeringCloud | null {
  if (c.ticksRemaining <= 1 || c.radius <= 0) return null;
  return {
    ...c,
    radius: Math.max(0, c.radius + c.perTickRadiusDelta),
    ticksRemaining: c.ticksRemaining - 1,
  };
}

export function contains(c: LingeringCloud, dx: number, dz: number): boolean {
  return dx * dx + dz * dz <= c.radius * c.radius;
}
