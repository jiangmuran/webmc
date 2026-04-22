// Pause menu state machine. ESC toggles the menu; while open, the game
// is paused in singleplayer. Menu items: resume, options, save-and-quit,
// open-to-LAN (host a session from an SP world), advancements, statistics.

export type PauseMenuScreen =
  | 'main'
  | 'options'
  | 'controls'
  | 'video'
  | 'audio'
  | 'chat'
  | 'advancements'
  | 'statistics'
  | 'open_to_lan'
  | 'quit_confirm';

export interface PauseMenuState {
  open: boolean;
  currentScreen: PauseMenuScreen;
  history: PauseMenuScreen[];
}

export function makePauseMenu(): PauseMenuState {
  return { open: false, currentScreen: 'main', history: [] };
}

export interface OpenResult {
  paused: boolean;
  screen: PauseMenuScreen;
}

export function openMenu(state: PauseMenuState): OpenResult {
  state.open = true;
  state.currentScreen = 'main';
  state.history = [];
  return { paused: true, screen: state.currentScreen };
}

export function closeMenu(state: PauseMenuState): boolean {
  if (!state.open) return false;
  state.open = false;
  return true;
}

export interface NavigateQuery {
  state: PauseMenuState;
  target: PauseMenuScreen;
}

export function navigate(q: NavigateQuery): void {
  q.state.history.push(q.state.currentScreen);
  q.state.currentScreen = q.target;
}

export function back(state: PauseMenuState): boolean {
  const prev = state.history.pop();
  if (!prev) return false;
  state.currentScreen = prev;
  return true;
}

// Quit flow: "Save and Quit" closes the world, returning to the main menu.
// In multiplayer, shows a confirmation to avoid accidentally leaving.
export interface QuitQuery {
  isMultiplayer: boolean;
}

export interface QuitResult {
  requiresConfirmation: boolean;
}

export function quitRequest(q: QuitQuery): QuitResult {
  return { requiresConfirmation: q.isMultiplayer };
}
