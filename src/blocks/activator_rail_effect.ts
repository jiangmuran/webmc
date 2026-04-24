export type CartType = 'normal' | 'tnt' | 'chest' | 'hopper' | 'furnace' | 'command';

export interface ActivatorInput {
  rails: number;
  powered: boolean;
  cartType: CartType;
  hasPassenger: boolean;
}

export function ejectsPassenger(i: ActivatorInput): boolean {
  return i.powered && i.hasPassenger && i.cartType === 'normal';
}

export function primesTnt(i: ActivatorInput): boolean {
  return i.powered && i.cartType === 'tnt';
}

export function togglesCommand(i: ActivatorInput, current: boolean): boolean {
  if (i.cartType !== 'command') return current;
  return i.powered ? !current : current;
}
