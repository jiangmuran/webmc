// Keybinding manager. Actions map to a physical key. Conflicts marked
// red in UI. Reset to defaults available.

export type ActionId =
  | 'forward'
  | 'back'
  | 'left'
  | 'right'
  | 'jump'
  | 'sneak'
  | 'sprint'
  | 'attack'
  | 'use'
  | 'inventory'
  | 'chat'
  | 'drop'
  | 'swap_hands';

export type KeyCode = string;

const DEFAULTS: Record<ActionId, KeyCode> = {
  forward: 'KeyW',
  back: 'KeyS',
  left: 'KeyA',
  right: 'KeyD',
  jump: 'Space',
  sneak: 'ShiftLeft',
  sprint: 'ControlLeft',
  attack: 'Mouse0',
  use: 'Mouse1',
  inventory: 'KeyE',
  chat: 'KeyT',
  drop: 'KeyQ',
  swap_hands: 'KeyF',
};

export class KeyBindings {
  private map: Map<ActionId, KeyCode>;

  constructor(initial?: Partial<Record<ActionId, KeyCode>>) {
    this.map = new Map(Object.entries(DEFAULTS) as [ActionId, KeyCode][]);
    if (initial) {
      for (const [k, v] of Object.entries(initial) as [ActionId, KeyCode][]) {
        this.map.set(k, v);
      }
    }
  }

  get(action: ActionId): KeyCode {
    return this.map.get(action) ?? DEFAULTS[action];
  }

  set(action: ActionId, key: KeyCode): void {
    this.map.set(action, key);
  }

  reset(): void {
    this.map = new Map(Object.entries(DEFAULTS) as [ActionId, KeyCode][]);
  }

  conflicts(): ActionId[][] {
    const byKey = new Map<KeyCode, ActionId[]>();
    for (const [a, k] of this.map) {
      const list = byKey.get(k) ?? [];
      list.push(a);
      byKey.set(k, list);
    }
    return [...byKey.values()].filter((v) => v.length > 1);
  }

  actionForKey(key: KeyCode): ActionId[] {
    const out: ActionId[] = [];
    for (const [a, k] of this.map) if (k === key) out.push(a);
    return out;
  }
}
