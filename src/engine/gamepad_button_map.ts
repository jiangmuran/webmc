export type Action =
  | 'jump'
  | 'sprint'
  | 'crouch'
  | 'attack'
  | 'use'
  | 'inventory'
  | 'hotbar_left'
  | 'hotbar_right';

export const DEFAULT_MAP: Record<number, Action> = {
  0: 'jump',
  1: 'sprint',
  2: 'attack',
  3: 'use',
  4: 'hotbar_left',
  5: 'hotbar_right',
  9: 'inventory',
  10: 'crouch',
};

export function actionForButton(btn: number): Action | undefined {
  return DEFAULT_MAP[btn];
}

export function isPressed(prev: boolean, curr: boolean): boolean {
  return curr && !prev;
}
