export type PauseAction =
  | 'resume'
  | 'achievements'
  | 'stats'
  | 'options'
  | 'open_to_lan'
  | 'feedback'
  | 'advancements'
  | 'save_and_quit'
  | 'disconnect';

export interface PauseMenuContext {
  isMultiplayer: boolean;
  isHost: boolean;
}

export function availableButtons(ctx: PauseMenuContext): readonly PauseAction[] {
  const base: PauseAction[] = ['resume', 'advancements', 'stats', 'options'];
  if (!ctx.isMultiplayer) {
    return [...base, 'open_to_lan', 'save_and_quit'];
  }
  if (ctx.isHost) {
    return [...base, 'disconnect'];
  }
  return [...base, 'disconnect'];
}
