export type Action =
  | 'move_forward'
  | 'move_back'
  | 'move_left'
  | 'move_right'
  | 'jump'
  | 'sneak'
  | 'sprint'
  | 'attack'
  | 'use'
  | 'drop'
  | 'inventory'
  | 'chat'
  | 'command'
  | 'pause'
  | 'pick_block'
  | 'swap_hands'
  | 'hotbar_1'
  | 'hotbar_2'
  | 'hotbar_3'
  | 'hotbar_4'
  | 'hotbar_5'
  | 'hotbar_6'
  | 'hotbar_7'
  | 'hotbar_8'
  | 'hotbar_9';

const DEFAULTS: Record<Action, string> = {
  move_forward: 'KeyW',
  move_back: 'KeyS',
  move_left: 'KeyA',
  move_right: 'KeyD',
  jump: 'Space',
  sneak: 'ShiftLeft',
  sprint: 'ControlLeft',
  attack: 'Mouse0',
  use: 'Mouse1',
  drop: 'KeyQ',
  inventory: 'KeyE',
  chat: 'KeyT',
  command: 'Slash',
  pause: 'Escape',
  pick_block: 'Mouse2',
  swap_hands: 'KeyF',
  hotbar_1: 'Digit1',
  hotbar_2: 'Digit2',
  hotbar_3: 'Digit3',
  hotbar_4: 'Digit4',
  hotbar_5: 'Digit5',
  hotbar_6: 'Digit6',
  hotbar_7: 'Digit7',
  hotbar_8: 'Digit8',
  hotbar_9: 'Digit9',
};

export function defaultBinding(a: Action): string {
  return DEFAULTS[a];
}

export function resolveAction(
  bindings: Readonly<Record<Action, string>>,
  key: string,
): Action | undefined {
  for (const k of Object.keys(bindings) as Action[]) {
    if (bindings[k] === key) return k;
  }
  return undefined;
}

export function cloneDefaults(): Record<Action, string> {
  return { ...DEFAULTS };
}
