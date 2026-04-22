// Input binding unassign. Players can remove a binding (set to none).
// Used to prevent actions on touch-only devices.

export type ActionId =
  | 'forward'
  | 'back'
  | 'left'
  | 'right'
  | 'jump'
  | 'attack'
  | 'use'
  | 'inventory'
  | 'chat'
  | 'drop';

export interface BindingMap {
  bound: Map<ActionId, string | null>;
}

export function makeBindings(defaults: Partial<Record<ActionId, string>> = {}): BindingMap {
  const m = new Map<ActionId, string | null>();
  for (const [k, v] of Object.entries(defaults) as [ActionId, string][]) m.set(k, v);
  return { bound: m };
}

export function rebind(b: BindingMap, action: ActionId, key: string): void {
  b.bound.set(action, key);
}

export function unbind(b: BindingMap, action: ActionId): void {
  b.bound.set(action, null);
}

export function isBound(b: BindingMap, action: ActionId): boolean {
  return b.bound.get(action) !== null && b.bound.get(action) !== undefined;
}

export function getBinding(b: BindingMap, action: ActionId): string | null {
  return b.bound.get(action) ?? null;
}
