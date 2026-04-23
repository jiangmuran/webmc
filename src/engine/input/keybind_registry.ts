// Keybind registry. Maps logical actions to physical keys.
// Allows remapping; keys are normalized to KeyboardEvent.code.

export type Action =
  | 'forward'
  | 'back'
  | 'left'
  | 'right'
  | 'jump'
  | 'sneak'
  | 'sprint'
  | 'attack'
  | 'use'
  | 'drop'
  | 'inventory'
  | 'chat'
  | 'command';

const DEFAULT: Record<Action, string> = {
  forward: 'KeyW',
  back: 'KeyS',
  left: 'KeyA',
  right: 'KeyD',
  jump: 'Space',
  sneak: 'ShiftLeft',
  sprint: 'ControlLeft',
  attack: 'Mouse0',
  use: 'Mouse1',
  drop: 'KeyQ',
  inventory: 'KeyE',
  chat: 'KeyT',
  command: 'Slash',
};

export interface Keybinds {
  map: Record<Action, string>;
}

export function defaultKeybinds(): Keybinds {
  return { map: { ...DEFAULT } };
}

export function setBind(k: Keybinds, action: Action, code: string): Keybinds {
  return { map: { ...k.map, [action]: code } };
}

export function actionForCode(k: Keybinds, code: string): Action | null {
  for (const a of Object.keys(k.map) as Action[]) if (k.map[a] === code) return a;
  return null;
}

export function hasConflict(k: Keybinds): Action[][] {
  const byCode = new Map<string, Action[]>();
  for (const a of Object.keys(k.map) as Action[]) {
    const code = k.map[a];
    if (!byCode.has(code)) byCode.set(code, []);
    byCode.get(code)?.push(a);
  }
  return [...byCode.values()].filter((v) => v.length > 1);
}
