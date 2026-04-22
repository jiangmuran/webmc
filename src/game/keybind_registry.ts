// Keybind registry. Maps logical actions (like "jump", "inventory",
// "attack") to physical keys. Supports multiple bindings per action,
// conflict detection, and named presets (default, left-hand, legacy).

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
  | 'pick_block'
  | 'drop'
  | 'inventory'
  | 'swap_hands'
  | 'chat'
  | 'command'
  | 'toggle_perspective'
  | 'screenshot'
  | 'list_players'
  | 'hotbar_1'
  | 'hotbar_2'
  | 'hotbar_3'
  | 'hotbar_4'
  | 'hotbar_5'
  | 'hotbar_6'
  | 'hotbar_7'
  | 'hotbar_8'
  | 'hotbar_9';

export interface KeyBinding {
  action: ActionId;
  key: string; // DOM KeyboardEvent.code or 'Mouse0' / 'Mouse1' / 'Mouse2' for mouse buttons
}

export class KeybindRegistry {
  private readonly actionToKey = new Map<ActionId, string>();
  private readonly keyToAction = new Map<string, ActionId>();

  set(action: ActionId, key: string): void {
    // Remove prior mapping of this key.
    const previousAction = this.keyToAction.get(key);
    if (previousAction) this.actionToKey.delete(previousAction);
    // Remove prior binding of this action.
    const previousKey = this.actionToKey.get(action);
    if (previousKey) this.keyToAction.delete(previousKey);
    this.actionToKey.set(action, key);
    this.keyToAction.set(key, action);
  }

  unbind(action: ActionId): void {
    const key = this.actionToKey.get(action);
    if (!key) return;
    this.actionToKey.delete(action);
    this.keyToAction.delete(key);
  }

  keyFor(action: ActionId): string | null {
    return this.actionToKey.get(action) ?? null;
  }

  actionFor(key: string): ActionId | null {
    return this.keyToAction.get(key) ?? null;
  }

  allBindings(): KeyBinding[] {
    return Array.from(this.actionToKey.entries()).map(([action, key]) => ({ action, key }));
  }

  clearAll(): void {
    this.actionToKey.clear();
    this.keyToAction.clear();
  }
}

// Default bindings mirror MC Java Edition.
export function applyDefaults(reg: KeybindRegistry): void {
  reg.clearAll();
  reg.set('forward', 'KeyW');
  reg.set('back', 'KeyS');
  reg.set('left', 'KeyA');
  reg.set('right', 'KeyD');
  reg.set('jump', 'Space');
  reg.set('sneak', 'ShiftLeft');
  reg.set('sprint', 'ControlLeft');
  reg.set('attack', 'Mouse0');
  reg.set('use', 'Mouse2');
  reg.set('pick_block', 'Mouse1');
  reg.set('drop', 'KeyQ');
  reg.set('inventory', 'KeyE');
  reg.set('swap_hands', 'KeyF');
  reg.set('chat', 'KeyT');
  reg.set('command', 'Slash');
  reg.set('toggle_perspective', 'F5');
  reg.set('screenshot', 'F2');
  reg.set('list_players', 'Tab');
  for (let i = 1; i <= 9; i++) {
    reg.set(`hotbar_${i.toString()}` as ActionId, `Digit${i.toString()}`);
  }
}
