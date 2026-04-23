export type MenuAction =
  | 'back_to_game'
  | 'save_and_quit'
  | 'options'
  | 'invite'
  | 'lan_world'
  | 'achievements';

export interface PauseState {
  singleplayer: boolean;
  isHost: boolean;
  lanOpen: boolean;
}

export function availableActions(s: PauseState): MenuAction[] {
  const base: MenuAction[] = ['back_to_game', 'options'];
  if (s.singleplayer) {
    base.push('save_and_quit');
    if (!s.lanOpen) base.push('lan_world');
  } else if (s.isHost) {
    base.push('invite');
  }
  base.push('achievements');
  return base;
}

export function pausesWorldSimulation(s: PauseState): boolean {
  return s.singleplayer;
}
