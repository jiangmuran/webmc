export interface FurnaceCart {
  fuelTicks: number;
  pushX: number;
  pushZ: number;
}

export const FUEL_PER_COAL = 3600;
export const PUSH_ACCELERATION = 0.0002;

export function addCoal(c: FurnaceCart): FurnaceCart {
  return { ...c, fuelTicks: c.fuelTicks + FUEL_PER_COAL };
}

export function tick(c: FurnaceCart): FurnaceCart {
  if (c.fuelTicks <= 0) return c;
  return { ...c, fuelTicks: c.fuelTicks - 1 };
}

export function isActive(c: FurnaceCart): boolean {
  return c.fuelTicks > 0;
}
