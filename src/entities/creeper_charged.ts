export interface Creeper {
  charged: boolean;
}

export const BASE_EXPLOSION_POWER = 3;
export const CHARGED_EXPLOSION_POWER = 6;

export function strikeByLightning(c: Creeper): Creeper {
  return { ...c, charged: true };
}

export function explosionPower(c: Creeper): number {
  return c.charged ? CHARGED_EXPLOSION_POWER : BASE_EXPLOSION_POWER;
}

export function dropsMobHead(c: Creeper): boolean {
  return c.charged;
}
